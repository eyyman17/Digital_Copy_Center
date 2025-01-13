from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('login/', views.login_api, name='login_api'),
    path('logout/', views.logout_api, name='logout_api'),
    path('password_reset/', views.password_reset_api, name='password_reset_api'),
    path('password_reset_confirm/<uidb64>/<token>/', views.password_reset_confirm_api, name='password_reset_confirm_api'),
]