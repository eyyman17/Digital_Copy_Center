from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .forms import DocumentForm
from .models import Document
from django.http import HttpResponse
from django.shortcuts import get_object_or_404


from django.http import JsonResponse


@login_required
def current_professor(request):
    """
    Return the name of the currently logged-in professor.
    """
    user = request.user
    name = f"{user.first_name} {user.last_name}".strip() or user.username
    return JsonResponse({"name": name})



@login_required
def submit_document(request):
    if request.method == "POST":
        form = DocumentForm(request.POST, request.FILES, user=request.user)
        if form.is_valid():
            document = form.save(commit=False)
            document.professeur = request.user
            document.save()
            return JsonResponse(
                {"success": True, "message": "Document soumis avec succès!"}, status=201
            )
        else:
            # Return validation errors
            errors = form.errors.as_json()
            return JsonResponse({"success": False, "errors": errors}, status=400)

    return JsonResponse({"success": False, "message": "Invalid request method."}, status=405)

from django.core.paginator import Paginator, EmptyPage

from datetime import datetime


@login_required
def professor_history(request):
    documents = Document.objects.filter(professeur=request.user).order_by('-date')
    
    # Get date filters from request if they exist
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    
    # Apply date filters if they exist
    if start_date:
        # Start from beginning of the start date
        start_datetime = datetime.strptime(start_date, '%Y-%m-%d')
        documents = documents.filter(date__gte=start_datetime)
    
    if end_date:
        # Include the entire end date by setting time to 23:59:59
        end_datetime = datetime.strptime(end_date, '%Y-%m-%d')
        end_datetime = end_datetime.replace(hour=23, minute=59, second=59)
        documents = documents.filter(date__lte=end_datetime)
    
    paginator = Paginator(documents, 10)  # 10 documents per page
    page_number = request.GET.get('page', 1)
    
    try:
        page_obj = paginator.get_page(page_number)
    except EmptyPage:
        # If page is out of range, deliver last page
        page_obj = paginator.get_page(paginator.num_pages)
    
    documents_data = [
        {
            'id': doc.id,
            'file_name': doc.document_file.name.split('/')[-1],
            'impression_pour': doc.impression_pour,
            'departement': doc.departement,
            'filiere': doc.filiere,
            'n_copies': doc.n_copies,
            'format': doc.format,
            'recto_verso': doc.recto_verso,
            'couleur': doc.couleur,
            'date': doc.date,
            'validation_impression': doc.validation_impression,
            'get_department_abbreviation': doc.get_department_abbreviation(),
            'get_filiere_abbreviation': doc.get_filiere_abbreviation(),
            'get_validation_impression_display': doc.get_validation_impression_display(),
        }
        for doc in page_obj.object_list
    ]

    response_data = {
        'results': documents_data,
        'total_pages': paginator.num_pages,
        'total_documents': paginator.count,
        'current_page': int(page_number)
    }
    
    return JsonResponse(response_data, safe=False)

import os
from django.http import FileResponse, Http404

@login_required
def download_document(request, document_id):
    """
    Handles file download for the Document model.
    """
    try:
        # Get the document object by its ID
        document = get_object_or_404(Document, id=document_id)

        # Access the `document_file` field (correct field name)
        file_path = document.document_file.path  # Full path to the file on disk
        file_name = document.document_file.name  # Name of the file

        # Ensure the file exists on disk
        if not file_path:
            raise FileNotFoundError

        # Serve the file for download
        return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_name)

    except FileNotFoundError:
        raise Http404("Le fichier demandé est introuvable.")
    except Exception as e:
        raise Http404(f"Une erreur s'est produite : {str(e)}")