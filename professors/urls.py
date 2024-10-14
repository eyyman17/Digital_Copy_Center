from django.urls import path
from . import views

urlpatterns = [
    path('professor/dashboard/', views.dashboard, name='professor_dashboard'),
]