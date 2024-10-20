from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required



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