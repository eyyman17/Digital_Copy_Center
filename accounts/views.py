from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.conf import settings


@login_required
def redirect_user(request):
    user = request.user
    if user.user_type == 'agent':
        return redirect('agent:agent_dashboard')
    elif user.user_type == 'direction':
        return redirect('direction:direction_dashboard')
    elif user.user_type == 'professor':
        return redirect('professors:submit_document')
    else:
        return redirect('login')  # Fallback
    
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView
from django.contrib import messages
from django.urls import reverse_lazy

class CustomPasswordResetView(PasswordResetView):
    template_name = 'reset/password_reset_form.html' 
    success_url = reverse_lazy('accounts:password_reset')  # Stay on the same page after success
    email_template_name='reset/password_reset_email.html',
    subject_template_name='reset/password_reset_subject.txt'

    def form_valid(self, form):
        messages.success(self.request, "Le lien de réinitialisation a été envoyé à votre adresse email.")
        return super().form_valid(form)


class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    template_name='reset/password_reset_confirm.html'
    success_url = reverse_lazy('accounts:password_reset_confirm')

    def form_valid(self, form):
        form.save()  # Ensure password is saved
        messages.success(self.request, "Votre mot de passe a été réinitialisé avec succès! Vous pouvez maintenant vous connecter.")
        return self.render_to_response(self.get_context_data(form=form))