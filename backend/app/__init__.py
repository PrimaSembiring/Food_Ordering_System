from pyramid.config import Configurator
from .database import SessionLocal

def main(global_config, **settings):
    config = Configurator(settings=settings)

    # DB session
    config.add_request_method(
        lambda request: SessionLocal(),
        'dbsession',
        reify=True
    )

    # CORS TWEEN (INI KUNCI)
    config.add_tween("app.tweens.cors_tween_factory")

    config.include("pyramid_tm")
    config.include("app.routes")
    config.scan("app.views")

    return config.make_wsgi_app()
