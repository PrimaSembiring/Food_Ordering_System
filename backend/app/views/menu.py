from pyramid.view import view_config
from app.database import get_session
from app.models.menu import MenuItem

@view_config(route_name="menu_list", request_method="GET", renderer="json")
def get_menu(request):
    db = get_session()
    menus = db.query(MenuItem).filter(MenuItem.available == True).all()

    return [
        {
            "id": m.id,
            "name": m.name,
            "category": m.category,
            "price": m.price,
            "image_url": m.image_url,
            "available": m.available
        }
        for m in menus
    ]
