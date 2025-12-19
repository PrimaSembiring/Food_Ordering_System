def includeme(config):
    # =====================
    # AUTH
    # =====================
    config.add_route("register", "/api/auth/register")
    config.add_route("login", "/api/auth/login")

    # =====================
    # MENU
    # =====================
    config.add_route("menu_list", "/api/menu")
    config.add_route("menu_detail", "/api/menu/{id}")

    # =====================
    # ORDERS
    # =====================
    config.add_route("orders", "/api/orders")
    config.add_route("order_status", "/api/orders/{id}/status")

    # =====================
    # REVIEWS  👈 INI YANG KURANG
    # =====================
    config.add_route("reviews", "/api/reviews")
