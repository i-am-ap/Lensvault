from __future__ import annotations

from datetime import datetime, timedelta, timezone

import jwt
from flask import current_app


def generate_token(username: str) -> str:
    issued_at = datetime.now(timezone.utc)
    expires_at = issued_at + timedelta(hours=current_app.config["JWT_EXPIRATION_HOURS"])

    payload = {
        "sub": username,
        "iat": int(issued_at.timestamp()),
        "exp": int(expires_at.timestamp()),
    }

    return jwt.encode(
        payload,
        current_app.config["JWT_SECRET_KEY"],
        algorithm="HS256",
    )


def decode_token(token: str) -> dict:
    return jwt.decode(
        token,
        current_app.config["JWT_SECRET_KEY"],
        algorithms=["HS256"],
    )

