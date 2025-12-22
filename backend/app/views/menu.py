from pyramid.view import view_config
from pyramid.response import Response

from app.models.menu import MenuItem
from app.security import require_auth, require_role

# =========================
# PUBLIC / CUSTOMER - GET MENU
# =========================
@view_config(route_name="menu_list", renderer="json", request_method="GET")
def get_menu(request):
    menus = request.dbsession.query(MenuItem).filter_by(available=True).all()
    return [
        {
            "id": m.id,
            "name": m.name,
            "price": m.price,
            "category": m.category,
        }
        for m in menus
    ]


# =========================
# OWNER - GET MENU
# =========================
@view_config(route_name="owner_menu", renderer="json", request_method="GET")
@require_auth
@require_role("owner")
def owner_get_menu(request):
    menus = request.dbsession.query(MenuItem).all()
    return [
        {
            "id": m.id,
            "name": m.name,
            "price": m.price,
            "available": m.available
        }
        for m in menus
    ]


# =========================
# OWNER - ADD MENU
# =========================
@view_config(route_name="owner_menu", renderer="json", request_method="POST")
@require_auth
@require_role("owner")
def owner_add_menu(request):
    data = request.json_body

    name = data.get("name")
    category = data.get("category")
    price = data.get("price")
    image_url = data.get("image_url")

    if not name or not category or price is None:
        return Response(
            json={"error": "Name, category, dan price wajib diisi"},
            status=400
        )

    try:
        price = int(price)
    except ValueError:
        return Response(
            json={"error": "Price harus berupa angka"},
            status=400
        )

    menu = MenuItem(
        name=name,
        category=category,
        price=price,
        image_url=image_url,
        available=True
    )

    request.dbsession.add(menu)
    request.dbsession.commit()

    return {
        "message": "Menu berhasil ditambahkan",
        "menu": {
            "id": menu.id,
            "name": menu.name,
            "category": menu.category,
            "price": menu.price,
            "available": menu.available
        }
    }

# =========================
# OWNER - UPDATE MENU
# =========================
@view_config(route_name="owner_menu_detail", renderer="json", request_method="PUT")
@require_auth
@require_role("owner")
def owner_update_menu(request):
    menu_id = int(request.matchdict["id"])

    try:
        data = request.json_body
    except Exception:
        data = {}

    menu = request.dbsession.get(MenuItem, menu_id)
    if not menu:
        return Response(json={"error": "Menu tidak ditemukan"}, status=404)

    if "name" in data:
        menu.name = data["name"]
    if "price" in data:
        menu.price = data["price"]
    if "available" in data:
        menu.available = data["available"]

    request.dbsession.commit()

    return {"message": "Menu berhasil diupdate"}




