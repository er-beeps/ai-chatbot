from .base import *

DEBUG = False

ALLOWED_HOSTS = config("ALLOWED_HOSTS", cast=lambda v: [s.strip() for s in v.split(",")])

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

CORS_ALLOWED_ORIGINS = config("ALLOWED_ORIGINS", cast=lambda v: [s.strip() for s in v.split(",")])
CSRF_TRUSTED_ORIGINS = config("ALLOWED_ORIGINS", cast=lambda v: [s.strip() for s in v.split(",")])