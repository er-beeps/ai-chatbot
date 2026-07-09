from django.urls import path
from .views_auth_api import *
from authentication.views import logout_then_login
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
app_name = "auth"

urlpatterns = [
    
    path('', api_home,name='api_home'),
    path('login/', login_api,name='login-api'),
    path("register/", register_api, name="api-register"),
    path("password-change/",password_change_api,name="password_change"),
    path("forgot-password/",forgot_password_api,name="api-forgot-password"),
    path("forgot-password-confirm/<str:token>/",forgot_password_confirm_api,name="api-forgot-password-confirm"),
    path("logout/", logout_api, name="logout"),
    path("csrf/", get_csrf_token, name="api-get-csrf-token"),
    path("user/",get_user_info,name="api-user-info"),
    path("google/", google_login_api, name="google-login"),
    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
