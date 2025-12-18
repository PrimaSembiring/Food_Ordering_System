from pyramid.config import Configurator

def main(global_config, **settings):
    config = Configurator(settings=settings)

    # === ROUTES HARUS DIDAFARKAN DULU ===
    config.include("app.routes")

    # === BARU SCAN SEMUA VIEW ===
    config.scan("app.views")

    return config.make_wsgi_app()
