from django.urls import path
from . import views

urlpatterns = [
    path('agent/dashboard/', views.dashboard, name='agent_dashboard'),
]