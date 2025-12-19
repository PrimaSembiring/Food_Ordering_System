from pyramid.config import Configurator
from pyramid.response import Response

def main(global_config, **settings):
    config = Configurator(settings=settings)

    config.include(".routes")
    config.scan(".views")

    return config.make_wsgi_app()
