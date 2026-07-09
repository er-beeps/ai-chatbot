import os
import importlib

DJANGO_ENV = os.environ.get("DJANGO_ENV", "local")

if DJANGO_ENV == "production":
    module = importlib.import_module("coreapp.settings.production")
elif DJANGO_ENV == "local":
    module = importlib.import_module("coreapp.settings.local")
else:
    module = importlib.import_module("coreapp.settings.local")

globals().update(vars(module))
