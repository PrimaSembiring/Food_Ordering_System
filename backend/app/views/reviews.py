from pyramid.view import view_config
from pyramid.response import Response
from app.database import SessionLocal
from app.models.review import Review
from app.models.menu import MenuItem
import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

# Helper: Ambil User Login
def get_current_user(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except:
        return None

# --- 1. TAMBAH REVIEW (POST) ---
@view_config(route_name="reviews", request_method="POST", renderer="json")
def create_review(request):
    user = get_current_user(request)
    if not user: # Hanya user login yang boleh review
        return Response(json_body={"error": "Unauthorized"}, status=401)

    db = SessionLocal()
    try:
        data = request.json_body
        
        # Validasi: Makanan ada gak?
        menu = db.query(MenuItem).filter(MenuItem.id == data["menu_item_id"]).first()
        if not menu:
             return Response(json_body={"error": "Menu not found"}, status=404)

        new_review = Review(
            rating=data["rating"],
            comment=data.get("comment", ""),
            customer_id=user["user_id"],
            menu_item_id=data["menu_item_id"]
        )

        db.add(new_review)
        db.commit()
        
        return {"message": "Review submitted", "rating": new_review.rating}
    finally:
        db.close()

# --- 2. LIHAT REVIEW PER MAKANAN (GET) ---
# URL: /api/menu/{id}/reviews
@view_config(route_name="menu_reviews", request_method="GET", renderer="json")
def get_menu_reviews(request):
    db = SessionLocal()
    try:
        menu_id = request.matchdict["id"]
        
        # Ambil semua review untuk makanan ID tersebut
        reviews = db.query(Review).filter(Review.menu_item_id == menu_id).all()
        
        return [
            {
                "id": r.id,
                "customer_name": r.customer.name if r.customer else "Unknown",
                "rating": r.rating,
                "comment": r.comment,
                "date": r.created_at.isoformat()
            }
            for r in reviews
        ]
    finally:
        db.close()