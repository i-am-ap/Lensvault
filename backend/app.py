from __future__ import annotations

from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from models import db
from routes.auth_routes import auth_bp
from routes.image_routes import image_bp
from utils.cloudinary_utils import init_cloudinary


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={r"/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=False,
    )

    db.init_app(app)

    with app.app_context():
        init_cloudinary()
        db.create_all()

    app.register_blueprint(auth_bp)
    app.register_blueprint(image_bp)

    @app.get("/health")
    def health_check():
        return jsonify({"status": "ok"})

    @app.errorhandler(413)
    def file_too_large(_error):
        return (
            jsonify(
                {
                    "message": (
                        f"File too large. Maximum size is {app.config['MAX_UPLOAD_SIZE_MB']} MB."
                    )
                }
            ),
            413,
        )

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"message": "Resource not found."}), 404

    @app.errorhandler(500)
    def internal_error(_error):
        return jsonify({"message": "An unexpected server error occurred."}), 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

