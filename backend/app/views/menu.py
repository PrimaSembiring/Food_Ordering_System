from pyramid.view import view_config
from app.database import SessionLocal
from app.models.menu import Menu

@view_config(route_name="menu", request_method="GET", renderer="json")
def list_menu(req):
    db = SessionLocal()
    return [m.__dict__ for m in db.query(Menu).all()]

@view_config(route_name="menu", request_method="POST", renderer="json", permission="authenticated")
def create_menu(req):
    db = SessionLocal()
    m = Menu(**req.json_body)
    db.add(m); db.commit()
    return m.__dict__
