from pyramid.config import Configurator
from .database import SessionLocal


def main(global_config, **settings):
    config = Configurator(settings=settings)

    config.add_request_method(
        lambda request: SessionLocal(),
        'dbsession',
        reify=True
    )

    config.include("pyramid_tm")
    config.include("app.routes")
    config.scan("app.views")

    return config.make_wsgi_app()
