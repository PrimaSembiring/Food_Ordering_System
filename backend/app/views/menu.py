from pyramid.view import view_config
from app.database import SessionLocal
from app.models.menu import MenuItem


@view_config(route_name="menu", request_method="GET", renderer="json")
def get_menu(request):
    db = SessionLocal()
    try:
        items = db.query(MenuItem).all()
        return [
            {
                "id": item.id,
                "name": item.name,
                "category": item.category,
                "price": item.price,
                "image_url": item.image_url,
                "available": item.available,
            }
            for item in items
        ]
    finally:
        db.close()


@view_config(route_name="menu", request_method="POST", renderer="json")
def create_menu(request):
    db = SessionLocal()
    data = request.json_body

    item = MenuItem(
        name=data["name"],
        category=data["category"],
        price=data["price"],
        image_url=data.get("image_url"),
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return {
        "id": item.id,
        "name": item.name,
        "category": item.category,
        "price": item.price,
        "image_url": item.image_url,
        "available": item.available,
    }
