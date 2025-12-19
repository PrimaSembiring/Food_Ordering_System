from pyramid.view import view_config
from pyramid.response import Response
from app.database import SessionLocal
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.menu import MenuItem
from app.models.user import User
import jwt
import os
from datetime import datetime

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

# --- HELPER: Cek Token & Ambil User ID ---
def get_current_user(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except:
        return None

# --- API: BUAT PESANAN BARU (CREATE ORDER) ---
@view_config(route_name="orders", request_method="POST", renderer="json")
def create_order(request):
    user_data = get_current_user(request)
    if not user_data:
        return Response(json_body={"error": "Unauthorized"}, status=401)

    db = SessionLocal()
    try:
        data = request.json_body
        items_request = data.get("items", []) # List item [{menu_item_id, quantity}]

        if not items_request:
            return Response(json_body={"error": "Cart is empty"}, status=400)

        # 1. Hitung Total Harga (Ambil harga asli dari DB, jangan dari frontend!)
        total_price = 0
        new_order_items = []

        for item in items_request:
            menu = db.query(MenuItem).filter(MenuItem.id == item["menu_item_id"]).first()
            if not menu:
                continue # Skip jika menu tidak ditemukan
            
            subtotal = menu.price * item["quantity"]
            total_price += subtotal
            
            # Siapkan data item untuk disimpan nanti
            new_order_items.append({
                "menu_item_id": menu.id,
                "price": menu.price,
                "quantity": item["quantity"]
            })

        # 2. Simpan Order Utama
        new_order = Order(
            customer_id=user_data["user_id"],
            total=total_price,
            status="PENDING", # Status awal
            order_date=datetime.utcnow()
        )
        db.add(new_order)
        db.flush() # Flush agar new_order.id terbentuk

        # 3. Simpan Detail Item (Order Items)
        for item_data in new_order_items:
            order_item = OrderItem(
                order_id=new_order.id,
                menu_item_id=item_data["menu_item_id"],
                price=item_data["price"],
                quantity=item_data["quantity"]
            )
            db.add(order_item)

        db.commit()

        return {
            "message": "Order placed successfully",
            "order_id": new_order.id,
            "total": total_price,
            "status": "PENDING"
        }

    except Exception as e:
        db.rollback()
        return Response(json_body={"error": str(e)}, status=500)
    finally:
        db.close()

# ... (kode import dan fungsi create_order biarkan sama) ...

# --- API: LIHAT PESANAN (GET ORDERS) ---
@view_config(route_name="orders", request_method="GET", renderer="json")
def get_orders(request):
    user_data = get_current_user(request)
    if not user_data:
        return Response(json_body={"error": "Unauthorized"}, status=401)

    db = SessionLocal()
    try:
        # Jika OWNER: Lihat semua pesanan
        if user_data["role"] == "owner":
            orders = db.query(Order).order_by(Order.order_date.desc()).all()
        # Jika CUSTOMER: Lihat pesanan sendiri saja
        else:
            orders = db.query(Order).filter(Order.customer_id == user_data["user_id"]).order_by(Order.order_date.desc()).all()

        return [
            {
                "id": o.id,
                "total": o.total,
                "status": o.status,
                "date": o.order_date.isoformat(),
                "customer_id": o.customer_id,
                # FITUR BARU: Menampilkan detail item
                "items": [
                    {
                        "menu_name": item.menu_item.name if item.menu_item else "Menu Terhapus",
                        "quantity": item.quantity,
                        "price": item.price
                    }
                    for item in o.items
                ]
            }
            for o in orders
        ]
    finally:
        db.close()
        
# ... (Kode Create Order & Get Order yang tadi, biarkan di atas) ...

# --- API: UPLOAD BUKTI PEMBAYARAN (CUSTOMER) ---
@view_config(route_name="order_payment", request_method="POST", renderer="json")
def submit_payment(request):
    user_data = get_current_user(request)
    if not user_data:
        return Response(json_body={"error": "Unauthorized"}, status=401)

    db = SessionLocal()
    try:
        order_id = request.matchdict["order_id"]
        order = db.query(Order).filter(Order.id == order_id).first()

        if not order:
            return Response(json_body={"error": "Order not found"}, status=404)

        # Pastikan yang bayar adalah pemilik pesanan
        if order.customer_id != user_data["user_id"]:
             return Response(json_body={"error": "Not your order"}, status=403)

        data = request.json_body
        
        # Update Status Pembayaran
        order.payment_method = data.get("payment_method", "TRANSFER")
        order.payment_proof = data.get("payment_proof", "bukti_transfer.jpg") # Simulasi nama file
        order.payment_status = "WAITING_VERIFICATION"
        order.status = "PAYMENT_UPLOADED" # Update status pesanan utama
        
        db.commit()

        return {
            "message": "Payment proof submitted",
            "order_id": order.id,
            "status": order.status
        }
    finally:
        db.close()

# --- API: VERIFIKASI PEMBAYARAN (OWNER ONLY) ---
@view_config(route_name="verify_payment", request_method="POST", renderer="json")
def verify_payment(request):
    user_data = get_current_user(request)
    # 1. Cek Login & Role Owner
    if not user_data or user_data["role"] != "owner":
        return Response(json_body={"error": "Forbidden. Owner access only"}, status=403)

    db = SessionLocal()
    try:
        order_id = request.matchdict["order_id"]
        order = db.query(Order).filter(Order.id == order_id).first()

        if not order:
            return Response(json_body={"error": "Order not found"}, status=404)

        data = request.json_body
        action = data.get("action") # 'accept' atau 'reject'

        if action == "accept":
            order.payment_status = "PAID"
            order.status = "PROCESSING" # Pesanan diproses dapur
        elif action == "reject":
            order.payment_status = "REJECTED"
            order.status = "PAYMENT_REJECTED"
        else:
            return Response(json_body={"error": "Invalid action"}, status=400)

        db.commit()

        return {
            "message": f"Payment {action}ed",
            "order_id": order.id,
            "payment_status": order.payment_status,
            "status": order.status
        }
    finally:
        db.close()