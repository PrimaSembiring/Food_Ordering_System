from pyramid.config import Configurator
from pyramid.events import NewResponse
from .database import SessionLocal


def add_cors_headers(event):
    response = event.response
    response.headers.update({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization,Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
    })


def main(global_config, **settings):
    config = Configurator(settings=settings)

    config.add_request_method(
        lambda request: SessionLocal(),
        'dbsession',
        reify=True
    )

    # CORS
    config.add_subscriber(add_cors_headers, NewResponse)

    config.include("pyramid_tm")
    config.include("app.routes")
    config.scan("app.views")

    return config.make_wsgi_app()
