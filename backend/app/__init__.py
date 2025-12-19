from pyramid.config import Configurator
from .database import DBSession

def main(global_config, **settings):
    config = Configurator(settings=settings)

    # DB session per request
    config.add_request_method(
        lambda request: DBSession(),
        'dbsession',
        reify=True
    )

    # Transaction manager (PENTING)
    config.include("pyramid_tm")

    # Routes & views
    config.include("app.routes")
    config.scan("app.views")

    return config.make_wsgi_app()
