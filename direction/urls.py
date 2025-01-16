from django.urls import path
from . import views


app_name = 'direction'

urlpatterns = [
    path('dashboard/', views.dashboard, name='direction_dashboard'),
    path('commandes/', views.command_list, name='command_list'),
    path('professeurs/', views.professor_list, name='professor_list'),
    path('creer-professeur/', views.professor_create, name='professor_create'),
    path('supprimer-professeur/', views.professor_delete, name='professor_delete'),
    path('download/<int:doc_id>/', views.download_document, name='download_document'),
    
]

