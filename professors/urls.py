from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = 'professors'

urlpatterns = [
    path('history/', views.professor_history, name='professor_history'),
    path('submit/', views.submit_document, name='submit_document'),
    path('documents/<pk>/download/', views.download_document, name='download_document'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

 

