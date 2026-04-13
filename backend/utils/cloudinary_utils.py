from __future__ import annotations

import cloudinary
import cloudinary.uploader
from flask import current_app


def cloudinary_is_configured() -> bool:
    required_keys = (
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
    )
    return all(current_app.config.get(key) for key in required_keys)


def init_cloudinary() -> None:
    cloudinary.config(
        cloud_name=current_app.config.get("CLOUDINARY_CLOUD_NAME"),
        api_key=current_app.config.get("CLOUDINARY_API_KEY"),
        api_secret=current_app.config.get("CLOUDINARY_API_SECRET"),
        secure=True,
    )


def upload_image_to_cloudinary(file_storage, image_id: str) -> dict:
    upload_result = cloudinary.uploader.upload(
        file_storage,
        folder=current_app.config["CLOUDINARY_FOLDER"],
        public_id=image_id,
        overwrite=False,
        resource_type="image",
    )

    return {
        "url": upload_result["secure_url"],
        "public_id": upload_result["public_id"],
    }


def delete_image_from_cloudinary(public_id: str) -> None:
    cloudinary.uploader.destroy(
        public_id,
        invalidate=True,
        resource_type="image",
    )
