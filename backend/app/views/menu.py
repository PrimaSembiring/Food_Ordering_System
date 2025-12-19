from pyramid.view import view_config
from pyramid.response import Response
from app.models.menu import MenuItem

# GET /api/menu
@view_config(route_name="menu_list", renderer="json", request_method="GET")
def get_menu(request):
    menus = request.dbsession.query(MenuItem).all()
    return [
        {
            "id": m.id,
            "name": m.name,
            "category": m.category,
            "price": m.price,
            "available": m.available
        } for m in menus
    ]


# POST /api/menu
@view_config(route_name="menu_list", renderer="json", request_method="POST")
def create_menu(request):
    data = request.json_body

    menu = MenuItem(
        name=data["name"],
        category=data["category"],
        price=data["price"],
        image_url=data.get("image_url"),
        available=True
    )

    request.dbsession.add(menu)
    request.dbsession.flush()

    return {
        "message": "Menu created",
        "id": menu.id
    }


# PUT /api/menu/{id}
@view_config(route_name="menu_detail", renderer="json", request_method="PUT")
def update_menu(request):
    menu_id = int(request.matchdict["id"])
    menu = request.dbsession.query(MenuItem).get(menu_id)

    if not menu:
        return Response(json={"error": "Menu not found"}, status=404)

    data = request.json_body
    menu.name = data.get("name", menu.name)
    menu.category = data.get("category", menu.category)
    menu.price = data.get("price", menu.price)
    menu.available = data.get("available", menu.available)

    return {"message": "Menu updated"}


# DELETE /api/menu/{id}
@view_config(route_name="menu_detail", renderer="json", request_method="DELETE")
def delete_menu(request):
    menu_id = int(request.matchdict["id"])
    menu = request.dbsession.query(MenuItem).get(menu_id)

    if not menu:
        return Response(json={"error": "Menu not found"}, status=404)

    request.dbsession.delete(menu)
    return {"message": "Menu deleted"}
