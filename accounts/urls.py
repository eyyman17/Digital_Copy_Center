from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('csrf/', views.get_csrf_token, name='get_csrf_token'),
    path('login/', views.login_api, name='login'),
    path('logout/', views.logout_api, name='logout'),
    path('password_reset/', views.password_reset_api, name='password_reset_api'),
    path('password_reset_confirm/<uidb64>/<token>/', views.password_reset_confirm_api, name='password_reset_confirm_api'),
]

