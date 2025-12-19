from pyramid.paster import get_app, setup_logging

if __name__ == "__main__":
    setup_logging("development.ini")
    app = get_app("development.ini", "main")
