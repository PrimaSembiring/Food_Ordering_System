from pyramid.view import view_config
from pyramid.response import Response
from app.database import SessionLocal
from app.models.menu import MenuItem


# --- 1. LIHAT MENU (GET) - VERSI FINAL ---
@view_config(route_name="menu", request_method="GET", renderer="json")
def get_menu(request):
    db = SessionLocal()
    try:
        # PERBAIKAN: Tambahkan .filter(MenuItem.available == True)
        # Artinya: "Tolong ambilkan menu yang statusnya AVAILABLE saja"
        items = db.query(MenuItem).filter(MenuItem.available == True).all()
        
        return [
            {
                "id": item.id,
                "name": item.name,
                "category": item.category,
                "price": item.price,
                "image": item.image_url,    # Kunci untuk Frontend
                "image_url": item.image_url,
                "available": item.available,
            }
            for item in items
        ]
    finally:
        db.close()

# --- 2. TAMBAH MENU (POST) ---
@view_config(route_name="menu", request_method="POST", renderer="json")
def create_menu(request):
    db = SessionLocal()
    try:
        data = request.json_body
        item = MenuItem(
            name=data["name"],
            category=data["category"],
            price=data["price"],
            image_url=data.get("image_url") or data.get("image"), # Cek kedua key
            available=True
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return {
            "message": "Menu created successfully",
            "id": item.id,
            "name": item.name
        }
    except Exception as e:
        return Response(json_body={"error": str(e)}, status=500)
    finally:
        db.close()

# --- 3. EDIT MENU (PUT) ---
@view_config(route_name="menu_id", request_method="PUT", renderer="json")
def update_menu(request):
    db = SessionLocal()
    try:
        # Ambil ID dari URL (misal: /api/menu/1 -> id=1)
        menu_id = request.matchdict["id"]
        item = db.query(MenuItem).filter(MenuItem.id == menu_id).first()

        if not item:
            return Response(json_body={"error": "Menu not found"}, status=404)

        data = request.json_body
        
        # Update data jika ada yang dikirim
        if "name" in data: item.name = data["name"]
        if "category" in data: item.category = data["category"]
        if "price" in data: item.price = data["price"]
        if "image" in data: item.image_url = data["image"]
        if "image_url" in data: item.image_url = data["image_url"]
        if "available" in data: item.available = data["available"]

        db.commit()
        
        return {"message": "Menu updated successfully", "id": item.id}
    except Exception as e:
        return Response(json_body={"error": str(e)}, status=500)
    finally:
        db.close()

# --- 4. HAPUS MENU (SOFT DELETE - AMAN) ---
@view_config(route_name="menu_id", request_method="DELETE", renderer="json")
def delete_menu(request):
    db = SessionLocal()
    try:
        # 1. Cek Token & Role Owner
        auth_header = request.headers.get("Authorization")
        if not auth_header:
             return Response(json_body={"error": "Missing Token"}, status=401)
             
        # (Opsional: Anda bisa pakai fungsi get_current_user untuk validasi role owner di sini)
        
        menu_id = request.matchdict["id"]
        item = db.query(MenuItem).filter(MenuItem.id == menu_id).first()

        if not item:
            return Response(json_body={"error": "Menu not found"}, status=404)

        # 2. JANGAN pakai db.delete(item)
        # Gunakan Soft Delete: Set available = False
        item.available = False 
        
        db.commit()

        return {"message": "Menu deleted successfully (hidden from public)"}
    except Exception as e:
        db.rollback()
        return Response(json_body={"error": str(e)}, status=500)
    finally:
        db.close()