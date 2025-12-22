from pyramid.view import view_config
from pyramid.response import Response

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.menu import MenuItem
from app.models.user import User

from app.security import require_auth, require_role
from app.constanta import (
    ORDER_PENDING,
    ORDER_PAYMENT_UPLOADED,
    ORDER_CONFIRMED,
    ORDER_CANCELLED,
    PAYMENT_UNPAID,
    PAYMENT_WAITING_VERIFICATION,
    PAYMENT_PAID,
    PAYMENT_REJECTED,
)

# ======================================================
# CUSTOMER - CREATE ORDER
# ======================================================
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
    order_items = []

    for item in items:
        menu_id = item.get("menu_item_id")
        quantity = item.get("quantity")

        if not menu_id or not isinstance(quantity, int) or quantity <= 0:
            return Response(json={"error": "Invalid item data"}, status=400)

        menu = request.dbsession.get(MenuItem, menu_id)
        if not menu or not menu.available:
            return Response(json={"error": "Menu not available"}, status=400)

        subtotal = menu.price * quantity
        total += subtotal
        order_items.append((menu_id, quantity, menu.price))

    order = Order(
        customer_id=user_id,
        total=total,
        status=ORDER_PENDING,
        payment_status=PAYMENT_UNPAID
    )

    request.dbsession.add(order)
    request.dbsession.flush()

    for menu_id, qty, price in order_items:
        request.dbsession.add(
            OrderItem(
                order_id=order.id,
                menu_item_id=menu_id,
                quantity=qty,
                price=price
            )
        )

    request.dbsession.commit()

    return {
        "message": "Order created",
        "order_id": order.id,
        "total": total
    }


# ======================================================
# CUSTOMER - LIST MY ORDERS
# ======================================================
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
            "order_date": o.order_date.isoformat()
        }
        for o in orders
    ]


# ======================================================
# CUSTOMER - ORDER DETAIL
# ======================================================
@view_config(route_name="order_detail", renderer="json", request_method="GET")
@require_auth
@require_role("customer")
def customer_order_detail(request):
    order_id = int(request.matchdict["id"])
    user_id = request.user["user_id"]

    order = request.dbsession.query(Order).filter_by(
        id=order_id,
        customer_id=user_id
    ).first()

    if not order:
        return Response(json={"error": "Order not found"}, status=404)

    return {
        "id": order.id,
        "total": order.total,
        "status": order.status,
        "payment_status": order.payment_status,
        "items": [
            {
                "menu_name": i.menu.name,
                "quantity": i.quantity,
                "price": i.price,
                "subtotal": i.quantity * i.price
            }
            for i in order.items
        ]
    }


# ======================================================
# CUSTOMER - SUBMIT PAYMENT
# ======================================================
@view_config(route_name="order_status", renderer="json", request_method="POST")
@require_auth
@require_role("customer")
def submit_payment(request):
    order_id = int(request.matchdict["id"])
    data = request.json_body
    user_id = request.user["user_id"]

    order = request.dbsession.query(Order).filter_by(
        id=order_id,
        customer_id=user_id
    ).first()

    if not order:
        return Response(json={"error": "Order not found"}, status=404)

    payment_method = data.get("payment_method")
    if not payment_method:
        return Response(json={"error": "Payment method required"}, status=400)

    order.payment_method = payment_method
    order.payment_status = PAYMENT_WAITING_VERIFICATION
    order.status = ORDER_PAYMENT_UPLOADED

    request.dbsession.commit()

    return {"message": "Payment submitted"}


# ======================================================
# OWNER - LIST ALL ORDERS
# ======================================================
@view_config(route_name="admin_orders", renderer="json", request_method="GET")
@require_auth
@require_role("owner")
def admin_list_orders(request):
    orders = request.dbsession.query(Order).join(User).all()

    return [
        {
            "id": o.id,
            "customer": o.customer.email,
            "total": o.total,
            "status": o.status,
            "payment_status": o.payment_status,
            "items": [
                {
                    "menu_name": i.menu.name,
                    "quantity": i.quantity,
                    "price": i.price,
                    "subtotal": i.quantity * i.price
                }
                for i in o.items
            ]
        }
        for o in orders
    ]


# ======================================================
# OWNER - VERIFY PAYMENT
# ======================================================
@view_config(route_name="admin_verify_order", renderer="json", request_method="POST")
@require_auth
@require_role("owner")
def admin_verify_payment(request):
    order_id = int(request.matchdict["id"])
    action = request.json_body.get("action")

    order = request.dbsession.get(Order, order_id)
    if not order:
        return Response(json={"error": "Order not found"}, status=404)

    if action == "approve":
        order.payment_status = PAYMENT_PAID
        order.status = ORDER_CONFIRMED
    elif action == "reject":
        order.payment_status = PAYMENT_REJECTED
        order.status = ORDER_CANCELLED
    else:
        return Response(json={"error": "Invalid action"}, status=400)

    request.dbsession.commit()
    return {"message": "Order updated"}
