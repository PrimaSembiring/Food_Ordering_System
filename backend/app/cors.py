from pyramid.events import NewRequest
from pyramid.response import Response

def add_cors_headers(event):
    response = event.request.response

    response.headers.update({
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Allow-Credentials": "true",
    })

def options_view(request):
    response = Response()
    response.headers.update({
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Allow-Credentials": "true",
    })
    return response

def includeme(config):
    config.add_subscriber(add_cors_headers, NewRequest)

    # HANDLE PREFLIGHT
    config.add_view(
        options_view,
        request_method="OPTIONS"
    )
