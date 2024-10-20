from django.urls import path
from django.urls import reverse_lazy
from django.contrib.auth import views as auth_views
from . import views


urlpatterns = [
    path('login/', auth_views.LoginView.as_view(
        template_name='login.html',
        redirect_authenticated_user=True
    ), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path('redirect/', views.redirect_user, name='redirect_user'),


    # Password reset URLs
    path('password_reset/', views.CustomPasswordResetView.as_view(), name='password_reset'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(
                template_name='reset/password_reset_confirm.html'
                ), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(
                template_name='reset/password_reset_complete.html'
                ), name='password_reset_complete'),
]