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
        if not menu:
            return Response(json={"error": f"Menu {menu_id} not found"}, status=404)

        if not menu.available:
            return Response(json={"error": f"Menu '{menu.name}' not available"}, status=400)

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

    orders = request.dbsession.query(Order).filter_by(customer_id=user_id).all()

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


# ======================================================
# CUSTOMER - SUBMIT PAYMENT (UPLOAD / PILIH METODE)
# ======================================================
@view_config(route_name="order_status", renderer="json", request_method="POST")
@require_auth
@require_role("customer")
def submit_payment(request):
    order_id = int(request.matchdict["id"])
    user_id = request.user["user_id"]
    data = request.json_body

    order = request.dbsession.query(Order).filter_by(
        id=order_id,
        customer_id=user_id
    ).first()

    if not order:
        return Response(json={"error": "Order not found"}, status=404)

    if order.payment_status != PAYMENT_UNPAID:
        return Response(json={"error": "Payment already submitted"}, status=400)

    payment_method = data.get("payment_method")
    if not payment_method:
        return Response(json={"error": "Payment method required"}, status=400)

    order.payment_method = payment_method
    order.payment_status = PAYMENT_WAITING_VERIFICATION
    order.status = ORDER_PAYMENT_UPLOADED

    request.dbsession.commit()

    return {
        "message": "Payment submitted, waiting verification",
        "order_id": order.id,
        "status": order.status,
        "payment_status": order.payment_status
    }


# ======================================================
# ADMIN - LIST ALL ORDERS
# ======================================================
@view_config(route_name="admin_orders", renderer="json", request_method="GET")
@require_auth
@require_role("admin")
def admin_list_orders(request):
    orders = request.dbsession.query(Order).join(User).all()
    result = []

    for o in orders:
        items = []
        for item in o.items:
            items.append({
                "menu_item_id": item.menu_item_id,
                "menu_name": item.menu.name if item.menu else None,
                "quantity": item.quantity,
                "price": item.price,
                "subtotal": item.quantity * item.price
            })

        result.append({
            "order_id": o.id,
            "customer": {
                "id": o.customer_id,
                "email": o.customer.email
            },
            "total": o.total,
            "status": o.status,
            "payment_status": o.payment_status,
            "payment_method": o.payment_method,
            "items": items
        })

    return result

# ======================================================
# ADMIN - APPROVE / REJECT PAYMENT
# ======================================================
@view_config(route_name="admin_verify_order", renderer="json", request_method="POST")
@require_auth
@require_role("admin")
def admin_verify_payment(request):
    order_id = int(request.matchdict["id"])
    data = request.json_body

    action = data.get("action")  # approve / reject
    if action not in ("approve", "reject"):
        return Response(
            json={"error": "Action must be 'approve' or 'reject'"},
            status=400
        )

    order = request.dbsession.query(Order).filter_by(id=order_id).first()
    if not order:
        return Response(json={"error": "Order not found"}, status=404)

    if order.payment_status != PAYMENT_WAITING_VERIFICATION:
        return Response(
            json={"error": "Order is not waiting for verification"},
            status=400
        )

    # =========================
    # APPROVE
    # =========================
    if action == "approve":
        order.payment_status = PAYMENT_PAID
        order.status = ORDER_CONFIRMED

    # =========================
    # REJECT
    # =========================
    if action == "reject":
        order.payment_status = PAYMENT_REJECTED
        order.status = ORDER_CANCELLED

    request.dbsession.commit()

    return {
        "message": f"Order {action}d successfully",
        "order_id": order.id,
        "status": order.status,
        "payment_status": order.payment_status
    }
