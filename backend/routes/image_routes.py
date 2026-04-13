from __future__ import annotations

import secrets
import string

from flask import Blueprint, current_app, jsonify, request

from middleware.auth_middleware import auth_required
from models import Image, db
from utils.cloudinary_utils import (
    cloudinary_is_configured,
    delete_image_from_cloudinary,
    upload_image_to_cloudinary,
)


image_bp = Blueprint("images", __name__)


def _generate_image_id(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def _allowed_file(filename: str, mime_type: str | None) -> bool:
    if "." not in filename:
        return False

    extension = filename.rsplit(".", 1)[1].lower()
    allowed_extensions = current_app.config["ALLOWED_IMAGE_EXTENSIONS"]
    allowed_mime_types = current_app.config["ALLOWED_IMAGE_MIME_TYPES"]

    return extension in allowed_extensions and mime_type in allowed_mime_types


def _build_image_response(image: Image) -> dict:
    return image.to_dict(current_app.config.get("PUBLIC_FRONTEND_URL"))


@image_bp.post("/upload")
@auth_required
def upload_image():
    title = (request.form.get("title") or "").strip()
    description = (request.form.get("description") or "").strip()
    file = request.files.get("image")

    if not cloudinary_is_configured():
        return (
            jsonify(
                {
                    "message": (
                        "Cloudinary is not configured on the backend. "
                        "Create backend/.env and set CLOUDINARY_CLOUD_NAME, "
                        "CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
                    )
                }
            ),
            500,
        )

    if not title:
        return jsonify({"message": "Title is required."}), 400

    if not file or not file.filename:
        return jsonify({"message": "An image file is required."}), 400

    if not _allowed_file(file.filename, file.mimetype):
        return (
            jsonify(
                {
                    "message": "Unsupported file type. Use png, jpg, jpeg, gif, or webp.",
                }
            ),
            400,
        )

    image_id = _generate_image_id()
    while Image.query.filter_by(image_id=image_id).first():
        image_id = _generate_image_id()

    try:
        upload_result = upload_image_to_cloudinary(file, image_id)
    except Exception as error:
        return (
            jsonify(
                {
                    "message": f"Cloudinary upload failed: {str(error) or 'unknown error'}"
                }
            ),
            502,
        )

    image = Image(
        image_id=image_id,
        title=title,
        description=description,
        image_url=upload_result["url"],
        cloudinary_public_id=upload_result["public_id"],
    )

    try:
        db.session.add(image)
        db.session.commit()
    except Exception:
        db.session.rollback()
        try:
            delete_image_from_cloudinary(upload_result["public_id"])
        except Exception:
            pass
        return jsonify({"message": "Failed to save image metadata."}), 500

    return jsonify({"message": "Image uploaded successfully.", "image": _build_image_response(image)}), 201


@image_bp.get("/image/<string:image_id>")
def get_image(image_id: str):
    image = Image.query.filter_by(image_id=image_id).first()

    if not image:
        return jsonify({"message": "Image not found."}), 404

    return jsonify({"image": _build_image_response(image)})


@image_bp.get("/images")
@auth_required
def list_images():
    images = Image.query.order_by(Image.uploaded_at.desc()).all()
    return jsonify({"images": [_build_image_response(image) for image in images]})
