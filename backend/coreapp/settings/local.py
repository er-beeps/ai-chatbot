from .base import *

DEBUG = True

ALLOWED_HOSTS = ["127.0.0.1", "localhost", ".localhost"]

# Override with slower/local email backend
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

CORS_ALLOWED_ORIGINS = config("ALLOWED_ORIGINS", cast=lambda v: [s.strip() for s in v.split(",")])
CSRF_TRUSTED_ORIGINS = config("ALLOWED_ORIGINS", cast=lambda v: [s.strip() for s in v.split(",")])