from pyramid.view import view_config
from app.database import SessionLocal
from app.models.order import Order
from app.models.order_item import OrderItem
from datetime import datetime

@view_config(route_name="orders", request_method="POST", renderer="json")
def create_order(req):
    db = SessionLocal()
    d = req.json_body

    order = Order(
        customerId=d["customerId"],
        customerName=d["customerName"],
        total=d["total"],
        status="pending",
        date=str(datetime.now())
    )
    db.add(order); db.commit()

    for i in d["items"]:
        db.add(OrderItem(
            order_id=order.id,
            name=i["name"],
            price=i["price"],
            quantity=i["quantity"]
        ))
    db.commit()

    return {"id": order.id}
