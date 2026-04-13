from __future__ import annotations

from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from models import Admin, db
from utils.jwt_utils import generate_token


auth_bp = Blueprint("auth", __name__)


def _get_admin() -> Admin | None:
    return Admin.query.order_by(Admin.created_at.asc()).first()


@auth_bp.get("/auth/status")
def auth_status():
    admin = _get_admin()
    return jsonify(
        {
            "has_admin": admin is not None,
            "admin": {"username": admin.username} if admin else None,
        }
    )


@auth_bp.post("/setup-admin")
def setup_admin():
    if _get_admin():
        return jsonify({"message": "Admin account is already configured."}), 409

    payload = request.get_json(silent=True) or {}
    username = (payload.get("username") or "").strip()
    password = payload.get("password") or ""

    if len(username) < 3:
        return jsonify({"message": "Username must be at least 3 characters."}), 400

    if len(password) < 8:
        return jsonify({"message": "Password must be at least 8 characters."}), 400

    admin = Admin(
        username=username,
        password_hash=generate_password_hash(password),
    )

    try:
        db.session.add(admin)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"message": "Unable to create admin account."}), 500

    return jsonify({"message": "Admin account created successfully."}), 201


@auth_bp.post("/login")
def login():
    admin = _get_admin()
    if not admin:
        return jsonify({"message": "No admin account exists yet. Complete setup first."}), 409

    payload = request.get_json(silent=True) or {}
    username = (payload.get("username") or "").strip()
    password = payload.get("password") or ""

    if not username or not password:
        return jsonify({"message": "Username and password are required."}), 400

    if username != admin.username:
        return jsonify({"message": "Invalid credentials."}), 401

    if not check_password_hash(admin.password_hash, password):
        return jsonify({"message": "Invalid credentials."}), 401

    token = generate_token(admin.username)

    return jsonify(
        {
            "token": token,
            "admin": {"username": admin.username},
        }
    )
