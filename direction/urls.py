from django.urls import path
from . import views

urlpatterns = [
    path('direction/dashboard/', views.dashboard, name='direction_dashboard'),
]