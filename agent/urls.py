from django.urls import path
from . import views

app_name = 'agent'

urlpatterns = [
    path('dashboard/', views.agent_dashboard, name='agent_dashboard'),
    path('submit/', views.agent_submit, name='submit'),
    path('approve-document/<int:doc_id>/', views.approve_document, name='approve_document'),
    path('approve/<str:token>/', views.professor_approval, name='professor_approval'),
    path('download/<int:doc_id>/', views.download_document, name='download_document'),
]