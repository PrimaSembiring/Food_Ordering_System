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
        return Response(json={"error": "Order items required"}, status=400)

    total = 0

    order = Order(
        customer_id=user_id,
        total=0,
        status="pending"
    )

    request.dbsession.add(order)
    request.dbsession.flush()

    for item in items:
        menu = request.dbsession.query(MenuItem).get(item.get("menu_item_id"))
        if not menu or not menu.available:
            return Response(
                json={"error": f"Menu {item.get('menu_item_id')} not available"},
                status=400
            )

        qty = int(item.get("quantity", 0))
        if qty <= 0:
            return Response(json={"error": "Invalid quantity"}, status=400)

        total += menu.price * qty

        request.dbsession.add(OrderItem(
            order_id=order.id,
            menu_item_id=menu.id,
            quantity=qty,
            price=menu.price
        ))

    order.total = total

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
    user_id = request.user["user_id"]
    data = request.json_body

    order = request.dbsession.query(Order).filter_by(
        id=order_id,
        customer_id=user_id
    ).first()

    if not order:
        return Response(json={"error": "Order not found"}, status=404)

    if order.payment_status == "paid":
        return Response(
            json={"error": "Order already paid"},
            status=400
        )

    order.payment_method = data.get("payment_method", "transfer")
    order.payment_status = "paid"
    order.status = "paid"

    return {
        "message": "Payment success",
        "order_id": order.id
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