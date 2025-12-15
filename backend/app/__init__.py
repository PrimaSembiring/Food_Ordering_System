from pyramid.config import Configurator

def main(global_config, **settings):
    config = Configurator(settings=settings)
    config.include(".jwt")
    config.include(".routes")
    config.scan("app.views")
    return config.make_wsgi_app()
