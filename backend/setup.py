from setuptools import setup, find_packages

setup(
    name="Food_Ordering_System",
    version="0.1",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "pyramid",
        "waitress",
        "sqlalchemy",
        "psycopg2-binary",
        "python-dotenv",
        "pyjwt",
        "pyramid_jinja2",
    ],
    entry_points={
        "paste.app_factory": [
            "main = app:main",
        ],
    },
)
