from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.shortcuts import get_object_or_404
from django.conf import settings

import json

@csrf_exempt
def login_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                return JsonResponse({'success': True, 'message': 'Login successful'})
            return JsonResponse({'success': False, 'error': 'Invalid credentials'}, status=401)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)


@csrf_exempt
def logout_api(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'success': True, 'message': 'Logout successful'})
    return JsonResponse({'error': 'Invalid method'}, status=405)


@csrf_exempt
def password_reset_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')

            user = User.objects.filter(email=email).first()
            if user:
                token = default_token_generator.make_token(user)
                uid = user.pk

                reset_link = f"{settings.FRONTEND_URL}/accounts/reset/{uid}/{token}/"
                send_mail(
                    'Password Reset Request',
                    f'Click the link to reset your password: {reset_link}',
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                )
                return JsonResponse({'success': True, 'message': 'Password reset link sent'})
            return JsonResponse({'success': False, 'error': 'Email not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)


@csrf_exempt
def password_reset_confirm_api(request, uidb64, token):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_password1 = data.get('new_password1')
            new_password2 = data.get('new_password2')

            if new_password1 != new_password2:
                return JsonResponse({'success': False, 'error': 'Passwords do not match'}, status=400)

            uid = force_str(urlsafe_base64_decode(uidb64))
            user = get_object_or_404(User, pk=uid)

            if default_token_generator.check_token(user, token):
                user.set_password(new_password1)
                user.save()
                return JsonResponse({'success': True, 'message': 'Password reset successful'})
            return JsonResponse({'success': False, 'error': 'Invalid or expired token'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)