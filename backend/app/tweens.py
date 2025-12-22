from pyramid.response import Response

def cors_tween_factory(handler, registry):
    def cors_tween(request):
        # HANDLE PREFLIGHT
        if request.method == "OPTIONS":
            response = Response()
        else:
            response = handler(request)

        response.headers.update({
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
            "Access-Control-Allow-Credentials": "true",
        })

        return response

    return cors_tween
