from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('history/', views.history, name='professor_history'),
    path('submit/', views.submit_document, name='submit_document'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),  
]