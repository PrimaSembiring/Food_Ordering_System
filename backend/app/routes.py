def includeme(config):
    config.add_route("register", "/api/register")
    config.add_route("login", "/api/login")

    config.add_route("menu", "/api/menu")
    config.add_route("menu_id", "/api/menu/{id}")

    config.add_route("orders", "/api/orders")
    
def includeme(config):
    config.add_route("orders", "/orders")
    config.add_route("order_payment", "/orders/{order_id}/payment")
    config.add_route("verify_payment", "/orders/{order_id}/verify-payment")

