from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_str, force_bytes
from django.shortcuts import get_object_or_404
from django.conf import settings

import json

@csrf_exempt
def login_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email') 
        password = data.get('password')

        auth_user = authenticate(request, username=email, password=password)
        if auth_user is not None:
            login(request, auth_user)
            return JsonResponse({
                'success': True,
                'message': 'Login successful',
                'user_type': auth_user.user_type
            })
        else:
            User = get_user_model()
            if User.objects.filter(email=email).exists():
                return JsonResponse({
                    'success': False,
                    'error': 'Mot de passe incorrect.'
                }, status=400)
            return JsonResponse({
                'success': False,
                'error': 'Aucun compte associé à cet email.'
            }, status=400)

    return JsonResponse({'error': 'Invalid method'}, status=405)



def logout_api(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'success': True, 'message': 'Logout successful'})
    return JsonResponse({'error': 'Invalid method'}, status=405)



@csrf_exempt
def password_reset_api(request):
    if request.method == 'POST':
        try:
            # Parse request data
            data = json.loads(request.body)
            email = data.get('email')
            
            # Check if user exists
            User = get_user_model()
            user = User.objects.filter(email=email).first()

            if user:
                # Generate token and link
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                
                reset_link = f"{settings.FRONTEND_URL}/accounts/password_reset_confirm/{uid}/{token}/"
                
                # Custom email content
                subject = 'ESITH Centre De Copie - Réinitialisation de votre mot de passe'
                
                # Plain text message
                plain_message = f"""
                Bonjour,
                Vous avez demandé de réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour procéder à la réinitialisation :

                {reset_link}

                Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet e-mail.

                Merci,
                ESITH Centre De Copie
                """
                
                # HTML message
                html_message = f"""
                <html>
                    <body>
                        <p>Bonjour,</p>
                        <p>Vous avez demandé de réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour procéder à la réinitialisation :</p>
                        <p><a href="{reset_link}">{reset_link}</a></p>
                        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet e-mail.</p>
                        <p>Merci,<br>ESITH Centre De Copie</p>
                    </body>
                </html>
                """

                # Send email with HTML content
                send_mail(
                    subject,
                    plain_message.strip(),  # Fallback plain-text message
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    html_message=html_message  # HTML message
                )
                
                return JsonResponse({'success': True, 'message': 'Le lien de réinitialisation du mot de passe a été envoyé à votre adresse email.'})
            return JsonResponse({'success': False, 'error': 'Adresse email introuvable.'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': 'Une erreur inattendue s\'est produite.'}, status=500)
    return JsonResponse({'success': False, 'error': 'Invalid method'}, status=405)


@csrf_exempt
def password_reset_confirm_api(request, uidb64, token):
    if request.method == 'POST':
        try:
            # Parse request body
            data = json.loads(request.body)
            new_password1 = data.get('new_password1')
            new_password2 = data.get('new_password2')

            # Validate password fields
            if not new_password1 or not new_password2:
                return JsonResponse({'success': False, 'error': 'Both passwords are required'}, status=400)
            if new_password1 != new_password2:
                return JsonResponse({'success': False, 'error': 'Passwords do not match'}, status=400)

            # Decode the user ID
            try:
                uid = force_str(urlsafe_base64_decode(uidb64))
                user = get_object_or_404(get_user_model(), pk=uid)
            except Exception:
                return JsonResponse({'success': False, 'error': 'Invalid user identifier'}, status=400)

            # Validate token
            if not default_token_generator.check_token(user, token):
                return JsonResponse({'success': False, 'error': 'Invalid or expired token'}, status=400)

            # Save new password
            user.set_password(new_password1)
            user.save()

            return JsonResponse({'success': True, 'message': 'Password reset successful'})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            # Provide specific error for debugging
            return JsonResponse({'success': False, 'error': f'Unexpected error: {str(e)}'}, status=500)

    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)