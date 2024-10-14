from django.urls import path
from . import views

urlpatterns = [
    path('administration/dashboard/', views.dashboard, name='administration_dashboard'),
]