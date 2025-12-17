from pyramid.view import view_config
from pyramid.response import Response
from datetime import datetime

from app.database import get_session
from app.models.order import Order
from app.models.order_item import OrderItem

@view_config(route_name="orders", request_method="POST", renderer="json")
def create_order(request):
    db = get_session()
    data = request.json_body

    try:
        order = Order(
            customer_id=data["customer_id"],
            total=data["total"],
            status="PENDING",
            order_date=datetime.utcnow(),
            payment_method=data.get("payment_method"),
            payment_status="UNPAID"
        )
        db.add(order)
        db.commit()
        db.refresh(order)

        for item in data["items"]:
            order_item = OrderItem(
                order_id=order.id,
                name=item["name"],
                price=item["price"],
                quantity=item["quantity"]
            )
            db.add(order_item)

        db.commit()

        return {
            "order_id": order.id,
            "status": order.status,
            "payment_status": order.payment_status
        }

    except Exception as e:
        db.rollback()
        return Response(
            json_body={"error": str(e)},
            status=500
        )
