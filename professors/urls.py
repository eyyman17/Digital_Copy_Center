from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = 'professors'

urlpatterns = [
    path('current-professor/', views.current_professor, name='current_professor'),
    path('document_submit/', views.submit_document, name='document_submit'),
    path('document_history/', views.professor_history, name='document_history'),
    path('documents/<pk>/download/', views.download_document, name='download_document'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

 

