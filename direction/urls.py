from django.urls import path
from . import views

app_name = 'direction'

urlpatterns = [
    path('dashboard/', views.dashboard, name='direction_dashboard'),
    path('direction_history/', views.get_documents, name='direction_history'),
    path('professors_list/', views.professors_list, name='professors_list'),
    path('delete_professor/<int:professor_id>/', views.delete_professor, name='delete_professor'),
    path('add_professor/', views.add_professor, name='add_professor'),
    
    
    
    path('search_professor/', views.search_professor, name='search_professor'),
    path('download/<int:doc_id>/', views.download_document, name='download_document'),
]