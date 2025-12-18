def includeme(config):
    # AUTH
    config.add_route("register", "/api/register")
    config.add_route("login", "/api/login")

    # MENU
    config.add_route("menu", "/api/menu")
    config.add_route("menu_id", "/api/menu/{id}")

    # ORDERS
    config.add_route("orders", "/api/orders")

    # PAYMENT
    config.add_route("order_payment", "/api/orders/{order_id}/payment")
    config.add_route("verify_payment", "/api/orders/{order_id}/verify-payment")
