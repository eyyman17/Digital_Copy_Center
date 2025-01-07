from django.urls import path
from . import views

app_name = 'direction'

urlpatterns = [
    path('dashboard/', views.dashboard, name='direction_dashboard'),
    path('commandes/', views.command_list, name='command_list'),
    path('download/<int:doc_id>/', views.download_document, name='download_document'),
    path('search_professor/', views.search_professor, name='search_professor'),
    path('professors/', views.professor_list, name='professor_list'),\
    path('professor_add/', views.add_professor, name='professor_add'),
    path('delete_professor/<int:professor_id>/', views.delete_professor, name='delete_professor'),
]