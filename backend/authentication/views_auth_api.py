from decouple import config
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.core.mail import EmailMessage, BadHeaderError
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import secrets

from authentication.models import ActivityLogs, User

from .serializers import (LoginSerializer, PasswordChangeSerializer,
                          RegisterSerializer, UserSerializer)

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"csrfToken": request.META.get("CSRF_COOKIE")})


@api_view(['GET'])
@permission_classes([AllowAny])
def api_home(request):
    users = User.objects.all()
    return Response({
        'message': 'Success',
        'status': True,
        'data': {
            'data': 'We are working in applicaiton',
        },
        'users':UserSerializer(users,many=True).data,
    })
    
    
# Login API
@api_view(["POST"])
@permission_classes([AllowAny])
def login_api(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        user = authenticate(username=username, password=password)

        if user is not None:

            # ✅ JWT tokens
            refresh = RefreshToken.for_user(user)

            user_data = UserSerializer(user).data
            log_user_login(request,user)
            return Response({
                "message": "Login successful",
                "results": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": user_data
                }
            }, status=status.HTTP_200_OK)
        
        log_user_login_failed(request,username)    
        return Response(
            {"message": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def refresh_token(request):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Token "):
        return Response({"message": "Token required"}, status=401)

    old_token = auth_header.replace("Token ", "")

    try:
        token_obj = Token.objects.get(key=old_token)
        user = token_obj.user

        token_obj.delete()
        new_token = Token.objects.create(user=user)
        
        user_data = UserSerializer(user).data
        results={
            'token':new_token.key,
            'user':user_data
        }
        return Response({"message": "Login successful",'results':results}, status=status.HTTP_200_OK)

    except Token.DoesNotExist:
        return Response({"message": "Invalid token"}, status=401)
        
# Registration API
@api_view(["POST"])
@permission_classes([AllowAny])
def register_api(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User registered successfully"}, status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Password change API
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def password_change_api(request):
    serializer = PasswordChangeSerializer(data=request.data)
    if serializer.is_valid():
        password1 = serializer.validated_data["password"]
        password2 = serializer.validated_data["confirm_password"]
        if password1 == password2:
            request.user.password = make_password(password1)
            request.user.is_password_changed = True
            request.user.save()
            logout(request)
            return Response(
                {"message": "Password changed successfully. Please login again."},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message": "Passwords do not match"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Forgot password - Send reset email
@api_view(["POST"])
@permission_classes([AllowAny])
def forgot_password_api(request):
    username = request.data.get("username")
    if not username:
        return Response(
            {"message": "Username is required"}, status=status.HTTP_400_BAD_REQUEST
        )
    try:
        user = User.objects.get(username=username)
        if user.email:
            token = secrets.token_hex(25)
            user.token = token
            user.save()
            subject = "Password Reset Request"
            from_email = config("EMAIL_HOST_USER")
            recipient_list = [user.email]
            base_url = settings.BASE_URL

            context = {"user": user, "base_url": base_url, "token": token}
            email_content = render_to_string("email/password_reset_email.html", context)
            email = EmailMessage(subject, email_content, from_email, recipient_list)
            email.content_subtype = "html"
            email.send()
            return Response(
                {"message": "Password reset link sent to registered email."},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message": "User email not configured."},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except User.DoesNotExist:
        return Response(
            {"message": "User not found."}, status=status.HTTP_404_NOT_FOUND
        )
    except BadHeaderError:
        return Response(
            {"message": "Invalid header found."}, status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Forgot password confirmation
@api_view(["POST"])
@permission_classes([AllowAny])
def forgot_password_confirm_api(request, token):
    try:
        user = User.objects.get(token=token)
        password1 = request.data.get("password")
        password2 = request.data.get("confirm_password")
        if password1 == password2:
            user.password = make_password(password1)
            user.is_password_changed = True
            user.token = ""
            user.save()
            return Response(
                {"message": "Password reset successful. Please login."},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except User.DoesNotExist:
        return Response(
            {"message": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Logout API
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_api(request):
    logout(request)
    return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    user_info = {
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_password_changed": user.is_password_changed,
    }
    return Response(user_info, status=status.HTTP_200_OK)


def get_client_ip(request):
    print(request)
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    return (
        x_forwarded_for.split(",")[0]
        if x_forwarded_for
        else request.META.get("REMOTE_ADDR")
    )
   
def log_user_login(request,user):
    LOGIN= "Login"
    message = f"{user.username} is logged in with ip:{get_client_ip(request)}"
    ActivityLogs.objects.create(actor=user, action_type=LOGIN, extra_data=message)


def log_user_login_failed(request,username, **kwargs):
    
    LOGIN_FAILED = "Login Failed"
    
    message = f"Login Attempt Failed for username: {username} with ip: {get_client_ip(request)}"
    ActivityLogs.objects.create(action_type=LOGIN_FAILED, extra_data=message)


@api_view(["POST"])
@permission_classes([AllowAny])
def google_login_api(request):
    token = request.data.get("code")
    print(token)
    if not token:
        return Response(
            {"message": "Google ID token is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        id_info = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            config("GOOGLE_CLIENT_ID"),
        )
        print(id_info)
    except ValueError:
        return Response(
            {"message": "Invalid Google token"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    email = id_info.get("email")
    email_verified = id_info.get("email_verified")

    if not email or not email_verified:
        return Response(
            {"message": "Google email is not verified"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    first_name = id_info.get("given_name", "")
    last_name = id_info.get("family_name", "")
    picture = id_info.get("picture")
    google_id = id_info.get("sub")

    user = User.objects.filter(email=email).first()

    if not user:

        base_username = email.split("@")[0]
        username = base_username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )

        user.set_unusable_password()
        user.save()

    refresh = RefreshToken.for_user(user)

    log_user_login(request, user)

    return Response(
        {
            "message": "Login successful",
            "results": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(user).data,
                "picture": picture,
                "google_id": google_id,
            },
        },
        status=status.HTTP_200_OK,
    )
                

