from pyramid.view import view_config
from pyramid.response import Response
from app.models.order import Order
from app.models.order_item import OrderItem
from app.security import require_auth, require_role

@view_config(route_name="orders", renderer="json", request_method="POST")
@require_auth
@require_role("customer")
def create_order(request):
    data = request.json_body
    user_id = request.user["user_id"]

    items = data.get("items")
    if not items or not isinstance(items, list):
        return Response(json={"error": "Order items required"}, status=400)

    total = sum(item["price"] * item["quantity"] for item in items)

    order = Order(
        customer_id=user_id,
        total=total,
        status="pending"
    )

    request.dbsession.add(order)
    request.dbsession.flush()  # ambil order.id

    for item in items:
        oi = OrderItem(
            order_id=order.id,
            menu_item_id=item["menu_item_id"],
            quantity=item["quantity"],
            price=item["price"]
        )
        request.dbsession.add(oi)

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
            "order_date": str(o.order_date)
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
        return Response(json={"error": "Order not found"}, status=404)

    # simulasi payment
    order.payment_method = data.get("payment_method", "transfer")
    order.payment_status = "paid"
    order.status = "paid"

    request.dbsession.commit()

    return {
        "message": "Payment success",
        "order_id": order.id,
        "status": order.status
    }


