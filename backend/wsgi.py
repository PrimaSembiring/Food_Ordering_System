import os
import sys

# === PASTIKAN backend MASUK PYTHONPATH ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from pyramid.config import Configurator
from waitress import serve


def main():
    config = Configurator(settings={
        "sqlalchemy.url": "postgresql://postgres:ragilbayu123@localhost:5432/db_makanan"
    })

    config.include("app.routes")
    config.scan("app.views")

    app = config.make_wsgi_app()
    return app


if __name__ == "__main__":
    app = main()
    print("🔥 BACKEND NYALA DI http://localhost:8000")
    serve(app, host="0.0.0.0", port=8000)
