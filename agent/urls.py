from django.urls import path
from . import views

app_name = 'agent'

urlpatterns = [
    path('dashboard/', views.agent_dashboard, name='agent_dashboard'),
    path('search_professor/', views.search_professor, name='search_professor'),
    path('download/<int:doc_id>/', views.download_document, name='download_document'),
    path('mark-as-printed/<int:document_id>/', views.mark_as_printed, name='mark_as_printed'),
    path('validate-and-recupere/<int:document_id>/', views.validate_and_mark_recupere, name='validate_and_recupere'),
]