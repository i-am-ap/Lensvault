from __future__ import annotations

from functools import wraps

import jwt
from flask import g, jsonify, request

from utils.jwt_utils import decode_token


def auth_required(view_function):
    @wraps(view_function)
    def wrapped_view(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        parts = auth_header.split()

        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"message": "Missing or invalid authorization header."}), 401

        token = parts[1]

        try:
            payload = decode_token(token)
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Session expired. Please sign in again."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token."}), 401

        g.current_admin = payload.get("sub")
        return view_function(*args, **kwargs)

    return wrapped_view

