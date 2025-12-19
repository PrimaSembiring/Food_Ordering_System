from pyramid.view import view_config
from app.models.order import Order
from app.models.order_item import OrderItem

# POST /api/orders
@view_config(route_name="orders", renderer="json", request_method="POST")
def create_order(request):
    data = request.json_body

    order = Order(
        customer_id=data["customer_id"],
        total=data["total"],
        status="pending"
    )
    request.dbsession.add(order)
    request.dbsession.flush()

    for item in data["items"]:
        order_item = OrderItem(
            order_id=order.id,
            menu_item_id=item["menu_item_id"],
            quantity=item["quantity"],
            price=item["price"]
        )
        request.dbsession.add(order_item)

    return {
        "message": "Order created",
        "order_id": order.id
    }


# GET /api/orders
@view_config(route_name="orders", renderer="json", request_method="GET")
def get_orders(request):
    orders = request.dbsession.query(Order).all()
    return [
        {
            "id": o.id,
            "total": o.total,
            "status": o.status
        } for o in orders
    ]


# PUT /api/orders/{id}/status
@view_config(route_name="order_status", renderer="json", request_method="PUT")
def update_order_status(request):
    order_id = int(request.matchdict["id"])
    order = request.dbsession.query(Order).get(order_id)

    if not order:
        return {"error": "Order not found"}

    order.status = request.json_body["status"]
    return {"message": "Status updated"}
