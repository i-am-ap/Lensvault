import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


def _default_database_uri() -> str:
    local_app_data = os.getenv("LOCALAPPDATA")
    database_dir = (
        Path(local_app_data) / "LensVault"
        if local_app_data
        else BASE_DIR / "data"
    )
    database_dir.mkdir(parents=True, exist_ok=True)
    return f"sqlite:///{(database_dir / 'lensvault.db').as_posix()}"


def _cors_origins() -> list[str]:
    raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me-before-production")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", _default_database_uri())
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")
    CLOUDINARY_FOLDER = os.getenv("CLOUDINARY_FOLDER", "private-image-share-platform")

    PUBLIC_FRONTEND_URL = os.getenv("PUBLIC_FRONTEND_URL", "http://localhost:5173")
    CORS_ORIGINS = _cors_origins()

    MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))
    MAX_CONTENT_LENGTH = MAX_UPLOAD_SIZE_MB * 1024 * 1024
    ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
    ALLOWED_IMAGE_MIME_TYPES = {
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "image/webp",
    }
