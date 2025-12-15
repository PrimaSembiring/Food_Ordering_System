def includeme(config):
    config.add_route("register", "/api/register")
    config.add_route("login", "/api/login")

    config.add_route("menu", "/api/menu")
    config.add_route("menu_id", "/api/menu/{id}")

    config.add_route("orders", "/api/orders")
