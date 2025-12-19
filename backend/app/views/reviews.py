from pyramid.view import view_config
from pyramid.response import Response
from app.models.review import Review


# POST /api/reviews
@view_config(route_name="reviews", renderer="json", request_method="POST")
def create_review(request):
    data = request.json_body

    review = Review(
        rating=data.get("rating"),
        comment=data.get("comment"),
        customer_id=data["customer_id"],
        menu_item_id=data["menu_item_id"]
    )

    request.dbsession.add(review)
    request.dbsession.flush()

    return {
        "message": "Review created",
        "review_id": review.id
    }


# GET /api/reviews
@view_config(route_name="reviews", renderer="json", request_method="GET")
def get_reviews(request):
    reviews = request.dbsession.query(Review).all()

    return [
        {
            "id": r.id,
            "rating": r.rating,
            "comment": r.comment,
            "customer_id": r.customer_id,
            "menu_item_id": r.menu_item_id
        }
        for r in reviews
    ]
