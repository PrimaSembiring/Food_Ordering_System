from pyramid.view import view_config
from pyramid.response import Response
from app.models.review import Review
from app.security import require_auth


@view_config(route_name="reviews", renderer="json", request_method="POST")
@require_auth
def create_review(request):
    user_id = request.user["user_id"]
    data = request.json_body

    rating = data.get("rating")
    menu_item_id = data.get("menu_item_id")

    if not isinstance(rating, int) or not (1 <= rating <= 5):
        return Response(
            json={"error": "Rating must be an integer between 1 and 5"},
            status=400
        )

    if not menu_item_id:
        return Response(
            json={"error": "menu_item_id required"},
            status=400
        )

    # CEGAH DOUBLE REVIEW
    existing = request.dbsession.query(Review).filter_by(
        customer_id=user_id,
        menu_item_id=menu_item_id
    ).first()

    if existing:
        return Response(
            json={"error": "You already reviewed this menu"},
            status=400
        )

    review = Review(
        rating=rating,
        comment=data.get("comment"),
        customer_id=user_id,
        menu_item_id=menu_item_id
    )

    request.dbsession.add(review)
    request.dbsession.commit()

    return {
        "message": "Review created",
        "review_id": review.id
    }


@view_config(route_name="reviews", renderer="json", request_method="GET")
def get_reviews(request):
    reviews = request.dbsession.query(Review).all()

    return [
        {
            "id": r.id,
            "rating": r.rating,
            "comment": r.comment,
            "customer_id": r.customer_id,
            "menu_item_id": r.menu_item_id,
            "created_at": r.created_at.isoformat()
        }
        for r in reviews
    ]
