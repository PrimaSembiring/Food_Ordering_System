from pyramid.response import Response


def success(data=None, message="Success"):
    return {
        "success": True,
        "message": message,
        "data": data
    }


def error(message="Error", status=400):
    return Response(
        json={
            "success": False,
            "message": message
        },
        status=status
    )
