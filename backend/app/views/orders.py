from pyramid.view import view_config
from pyramid.response import Response
from app.models.order import Order
from app.models.order_item import OrderItem
from app.security import require_auth, require_role
from app.models.menu import MenuItem
from app.models.user import User

@view_config(route_name="orders", renderer="json", request_method="POST")
@require_auth
@require_role("customer")
def create_order(request):
    data = request.json_body
    user_id = request.user["user_id"]

    items = data.get("items")
    if not items or not isinstance(items, list):
        return Response(
            json={"error": "Order items required"},
            status=400
        )

    total = 0
    order_items = []

    for item in items:
        menu_id = item.get("menu_item_id")
        quantity = item.get("quantity")

        if not menu_id or not quantity or quantity <= 0:
            return Response(
                json={"error": "Invalid menu item data"},
                status=400
            )

        menu = request.dbsession.query(MenuItem).get(menu_id)

        if not menu:
            return Response(
                json={"error": f"Menu item {menu_id} not found"},
                status=404
            )

        if not menu.available:
            return Response(
                json={"error": f"Menu '{menu.name}' is not available"},
                status=400
            )

        price = menu.price
        subtotal = price * quantity
        total += subtotal

        order_items.append({
            "menu_item_id": menu_id,
            "quantity": quantity,
            "price": price
        })

    # create order
    order = Order(
        customer_id=user_id,
        total=total,
        status="PENDING",
        payment_status="UNPAID"
    )

    request.dbsession.add(order)
    request.dbsession.flush()  # get order.id

    for oi in order_items:
        request.dbsession.add(
            OrderItem(
                order_id=order.id,
                menu_item_id=oi["menu_item_id"],
                quantity=oi["quantity"],
                price=oi["price"]
            )
        )

    request.dbsession.commit()

    return {
        "message": "Order created",
        "order_id": order.id,
        "total": total
    }


@view_config(route_name="orders", renderer="json", request_method="GET")
@require_auth
@require_role("customer")
def list_my_orders(request):
    user_id = request.user["user_id"]

    orders = request.dbsession.query(Order).filter_by(
        customer_id=user_id
    ).all()

    return [
        {
            "id": o.id,
            "total": o.total,
            "status": o.status,
            "payment_status": o.payment_status,
            "payment_method": o.payment_method
        }
        for o in orders
    ]

@view_config(route_name="order_status", renderer="json", request_method="POST")
@require_auth
@require_role("customer")
def update_order_status(request):
    order_id = int(request.matchdict["id"])
    data = request.json_body
    user_id = request.user["user_id"]

    order = request.dbsession.query(Order).filter_by(
        id=order_id,
        customer_id=user_id
    ).first()

    if not order:
        return Response(
            json={"error": "Order not found"},
            status=404
        )

    # 🔐 HARDENING STEP 2: Cegah payment ulang
    if order.payment_status == "PAID":
        return Response(
            json={"error": "Order already paid"},
            status=400
        )

    # optional: cegah status aneh
    if order.status == "PAID":
        return Response(
            json={"error": "Order already completed"},
            status=400
        )

    payment_method = data.get("payment_method")
    if not payment_method:
        return Response(
            json={"error": "Payment method required"},
            status=400
        )

    # simulasi payment sukses
    order.payment_method = payment_method
    order.payment_status = "PAID"
    order.status = "PAID"

    request.dbsession.commit()

    return {
        "message": "Payment success",
        "order_id": order.id,
        "status": order.status,
        "payment_status": order.payment_status
    }


@view_config(route_name="order_detail", renderer="json", request_method="GET")
@require_auth
@require_role("customer")
def get_order_detail(request):
    order_id = int(request.matchdict["id"])
    user_id = request.user["user_id"]

    order = request.dbsession.query(Order).filter_by(
        id=order_id,
        customer_id=user_id
    ).first()

    if not order:
        return Response(
            json={"error": "Order not found"},
            status=404
        )

    items = []
    for item in order.items:
        items.append({
            "menu_item_id": item.menu_item_id,
            "menu_name": item.menu.name if item.menu else None,
            "quantity": item.quantity,
            "price": item.price,
            "subtotal": item.price * item.quantity
        })

    return {
        "id": order.id,
        "total": order.total,
        "status": order.status,
        "payment_status": order.payment_status,
        "payment_method": order.payment_method,
        "items": items
    }

@view_config(route_name="admin_orders", renderer="json", request_method="GET")
@require_auth
@require_role("admin")
def admin_list_orders(request):
    orders = (
        request.dbsession.query(Order)
        .join(User, Order.customer_id == User.id)
        .all()
    )

    result = []

    for o in orders:
        items = []
        for item in o.items:
            items.append({
                "menu_item_id": item.menu_item_id,
                "menu_name": item.menu.name if item.menu else None,
                "quantity": item.quantity,
                "price": item.price,
                "subtotal": item.price * item.quantity
            })

        result.append({
            "order_id": o.id,
            "customer": {
                "id": o.customer_id,
                "email": o.customer.email if hasattr(o, "customer") else None
            },
            "total": o.total,
            "status": o.status,
            "payment_status": o.payment_status,
            "payment_method": o.payment_method,
            "items": items
        })

    return result