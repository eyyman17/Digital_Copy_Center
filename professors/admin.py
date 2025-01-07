from django.contrib import admin
from .models import Document

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('professeur', 'document_file', 'date', 'validation_impression', 'n_copies', 'format', 'couleur')
    search_fields = ('professeur__username', 'professeur__email', 'document_file')
    list_filter = ('validation_impression', 'format', 'couleur', 'date')