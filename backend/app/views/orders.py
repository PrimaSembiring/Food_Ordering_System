from pyramid.view import view_config
from pyramid.response import Response
from app.database import SessionLocal
from app.models.order import Order
from app.models.order_item import OrderItem
from datetime import datetime
import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")


@view_config(route_name="orders", request_method="POST", renderer="json")
def create_order(request):
    db = SessionLocal()

    # ===== AUTH HEADER =====
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response(
            json_body={"error": "Missing or invalid Authorization header"},
            status=401
        )

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return Response(json_body={"error": "Token expired"}, status=401)
    except jwt.InvalidTokenError:
        return Response(json_body={"error": "Invalid token"}, status=401)

    user_id = payload["user_id"]

    # ===== BODY =====
    try:
        data = request.json_body
    except Exception:
        return Response(
            json_body={"error": "Invalid JSON body"},
            status=400
        )

    # ===== CREATE ORDER =====
    order = Order(
        customer_id=user_id,
        total=data["total"],
        status="PENDING",
        order_date=datetime.utcnow(),
        payment_status="UNPAID"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    # ===== CREATE ORDER ITEMS =====
    for item in data["items"]:
        order_item = OrderItem(
            order_id=order.id,
            menu_item_id=item["menu_item_id"],   # ✅ BENAR
            price=item["price"],
            quantity=item["quantity"]
        )
        db.add(order_item)

    db.commit()

    return {
        "message": "Order created successfully",
        "order_id": order.id
    }
