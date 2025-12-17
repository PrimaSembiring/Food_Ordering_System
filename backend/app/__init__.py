from pyramid.config import Configurator

def main(global_config, **settings):
    config = Configurator(settings=settings)

    config.include("pyramid_jinja2")

    config.add_route("login", "/api/login")
    config.add_route("menu_list", "/api/menu")
    config.add_route("orders", "/api/orders")

    config.scan("app.views")

    return config.make_wsgi_app()
