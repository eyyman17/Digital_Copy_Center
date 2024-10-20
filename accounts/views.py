from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.conf import settings


@login_required
def redirect_user(request):
    user = request.user
    if user.user_type == 'agent':
        return redirect('agent_dashboard')
    elif user.user_type == 'direction':
        return redirect('direction_dashboard')
    elif user.user_type == 'professor':
        return redirect('professor_dashboard')
    else:
        return redirect('login')  # Fallback
    
from django.contrib.auth.views import PasswordResetView
from django.contrib import messages
from django.urls import reverse_lazy


class CustomPasswordResetView(PasswordResetView):
    template_name = 'reset/password_reset_form.html' 
    success_url = reverse_lazy('password_reset')  # Stay on the same page after success
    email_template_name='reset/password_reset_email.html',
    subject_template_name='reset/password_reset_subject.txt'

    def form_valid(self, form):
        messages.success(self.request, "Le lien de réinitialisation a été envoyé à votre adresse email.")
        return super().form_valid(form)
