import os
import sys

# Tambahkan backend ke PYTHONPATH
sys.path.insert(0, os.path.dirname(__file__))

from pyramid.paster import get_app, setup_logging


def main(global_config, **settings):
    setup_logging(global_config.get('__file__'))
    return get_app(global_config.get('__file__'), **settings)
