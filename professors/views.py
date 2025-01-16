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




@login_required
def professor_history(request):
    documents = Document.objects.filter(professeur=request.user).order_by('-date')
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
        for doc in documents
    ]
    return JsonResponse(documents_data, safe=False)


@login_required
def download_document(request, pk):
    document = get_object_or_404(Document, pk=pk)
    response = HttpResponse(document.document_file, content_type='application/octet-stream')
    response['Content-Disposition'] = 'attachment; filename="%s"' % document.document_file.name
    return response