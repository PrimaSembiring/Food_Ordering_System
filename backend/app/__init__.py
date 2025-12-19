from pyramid.config import Configurator
from .database import DBSession

def main(global_config, **settings):
    config = Configurator(settings=settings)

    config.add_request_method(
        lambda request: DBSession(),
        'dbsession',
        reify=True
    )

    config.include("pyramid_tm")        # WAJIB
    config.include("app.routes")        # WAJIB
    config.scan("app.views")            # WAJIB

    return config.make_wsgi_app()
