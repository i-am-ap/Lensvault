from __future__ import annotations

from datetime import datetime, timezone

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Image(db.Model):
    __tablename__ = "images"

    id = db.Column(db.Integer, primary_key=True)
    image_id = db.Column(db.String(32), unique=True, nullable=False, index=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False, default="")
    image_url = db.Column(db.String(500), nullable=False)
    cloudinary_public_id = db.Column(db.String(255), nullable=False, unique=True)
    uploaded_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self, frontend_url: str | None = None) -> dict:
        base_url = (frontend_url or "").rstrip("/")
        share_url = f"{base_url}/view/{self.image_id}" if base_url else f"/view/{self.image_id}"

        return {
            "id": self.id,
            "image_id": self.image_id,
            "title": self.title,
            "description": self.description,
            "image_url": self.image_url,
            "cloudinary_public_id": self.cloudinary_public_id,
            "uploaded_at": self.uploaded_at.isoformat(),
            "share_url": share_url,
        }

