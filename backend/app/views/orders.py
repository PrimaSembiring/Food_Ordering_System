from pyramid.view import view_config
from pyramid.response import Response
from app.database import SessionLocal
from app.models.order import Order
import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")


@view_config(
    route_name="order_payment",
    request_method="POST",
    renderer="json"
)
def submit_payment(request):
    db = SessionLocal()

    # ===== AUTH =====
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response(
            json_body={"error": "Unauthorized"},
            status=401
        )

    token = auth_header.split(" ")[1]
    try:
        jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except Exception:
        return Response(json_body={"error": "Invalid token"}, status=401)

    # ===== PARAM =====
    order_id = request.matchdict.get("order_id")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return Response(json_body={"error": "Order not found"}, status=404)

    # ===== BODY =====
    try:
        data = request.json_body
    except Exception:
        return Response(
            json_body={"error": "Invalid JSON body"},
            status=400
        )

    order.payment_method = data.get("payment_method", "TRANSFER")
    order.payment_status = "PAID"
    order.payment_proof = data.get("payment_proof")

    db.commit()

    return {
        "message": "Payment submitted",
        "order_id": order.id,
        "payment_status": order.payment_status
    }
