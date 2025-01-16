from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator
from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from accounts.models import CustomUser
from professors.models import Document
from django.core.mail import send_mail, BadHeaderError
import os


def is_agent(user):
    return user.is_authenticated and user.user_type == 'agent'


@login_required
@user_passes_test(is_agent)
def get_documents(request):
    """
    API endpoint to retrieve documents for the agent dashboard.
    Supports filtering by search query, date range, and status.
    """
    documents = Document.objects.all().order_by('-date')
    search_query = request.GET.get('search_query', '')
    date_from = request.GET.get('date_from')
    date_to = request.GET.get('date_to')
    status = request.GET.get('status')
    page = request.GET.get('page', 1)
    rows_per_page = 10

    # Apply filters
    if search_query:
        documents = documents.filter(
            Q(professeur__first_name__icontains=search_query) |
            Q(professeur__last_name__icontains=search_query) |
            Q(professeur__email__icontains=search_query)
        )
    if date_from:
        documents = documents.filter(date__gte=date_from)
    if date_to:
        documents = documents.filter(date__lte=date_to)
    if status:
        documents = documents.filter(validation_impression=status)

    # Add is_downloadable field
    for document in documents:
        document.is_downloadable = (timezone.now() - document.date) <= timedelta(days=7)

    # Paginate results
    paginator = Paginator(documents, rows_per_page)
    paginated_documents = paginator.get_page(page)

    # Serialize documents for JSON response
    documents_data = [
        {
            "id": doc.id,
            "file_name": doc.document_file.name.split('/')[-1],
            "professeur": f"{doc.professeur.first_name} {doc.professeur.last_name}",
            "impression_pour": doc.impression_pour,
            "departement": doc.get_department_abbreviation(),
            "filiere": doc.get_filiere_abbreviation(),
            "n_copies": doc.n_copies,
            "format": doc.format,
            "recto_verso": doc.recto_verso,
            "couleur": doc.couleur,
            "date": doc.date.isoformat(),
            "status": doc.get_validation_impression_display(),
            "is_downloadable": doc.is_downloadable,
        }
        for doc in paginated_documents
    ]

    return JsonResponse({
        "documents": documents_data,
        "current_page": paginated_documents.number,
        "total_pages": paginator.num_pages,
    })

from django.core.mail import send_mail, BadHeaderError
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
import os


@login_required
@user_passes_test(is_agent)
def mark_as_printed(request, document_id):
    """
    Mark a document as printed and send a notification email to the professor.
    """
    document = get_object_or_404(Document, id=document_id)

    if request.method == "POST":
        document.generate_code()
        try:
            send_mail(
                subject='Document prêt à être récupéré',
                message=f"""Bonjour {document.professeur.first_name},

Votre document '{os.path.basename(document.document_file.name)}' a été imprimé et est prêt à être récupéré.

Code de retrait : {document.code_validation}

Veuillez présenter ce code à l'agent au moment de la récupération de votre document.

Merci de votre confiance.
Cordialement,
L'équipe du centre de copie numérique.""",
                from_email='noreply@example.com',
                recipient_list=[document.professeur.email],
                fail_silently=False,
                html_message=f"""
                <html>
                <body>
                    <p>Bonjour {document.professeur.first_name},</p>
                    <p>Votre document '<strong>{os.path.basename(document.document_file.name)}</strong>' a été imprimé et est prêt à être récupéré.</p>
                    <p><strong style="font-size: 14px;">Code de retrait :</strong> <strong style="font-size: 18px;">{document.code_validation}</strong></p>
                    <p><strong style="font-size: 14px;">Veuillez présenter ce code à l'agent au moment de la récupération de votre document.</strong></p>
                    <p>Merci de votre confiance.</p>
                    <p>Cordialement,<br>ESITH Centre De Copie</p>
                </body>
                </html>
                """
            )
        except BadHeaderError:
            return JsonResponse({"success": False, "error": "Failed to send email. Invalid header."})

        document.validation_impression = 'imprimé'
        document.save()

        return JsonResponse({
            "success": True,
            "new_status": "imprimé",
            "new_status_label": "Imprimé"
        })

    return JsonResponse({"success": False, "error": "Invalid request method."})


import json

@login_required
@user_passes_test(is_agent)
def validate_and_mark_recupere(request, document_id):
    document = get_object_or_404(Document, id=document_id)

    if request.method == "POST":
        try:
            body = json.loads(request.body)  # Parse JSON data
            input_code = body.get("code")  # Get 'code' from the JSON payload
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON body."})

        if input_code == document.code_validation:  # Validate the code
            document.validation_impression = 'recupéré'
            document.save()
            return JsonResponse({
                "success": True,
                "new_status": "recupéré",
                "new_status_label": "Récupéré"
            })
        else:
            return JsonResponse({"success": False, "error": "Invalid validation code."})

    return JsonResponse({"success": False, "error": "Invalid request method."})


@login_required
@user_passes_test(is_agent)
def search_professor(request):
    """
    API endpoint to search for professors by name or email.
    """
    query = request.GET.get('q', '')
    if not query:
        return JsonResponse([], safe=False)

    results = CustomUser.objects.filter(
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(email__icontains=query),
        user_type='professor'
    ).values('id', 'first_name', 'last_name', 'email')[:10]

    return JsonResponse(list(results), safe=False)


@login_required
@user_passes_test(is_agent)
def download_document(request, document_id):
    """
    Download the document if it exists.
    """
    document = get_object_or_404(Document, id=document_id)
    response = HttpResponse(document.document_file, content_type='application/octet-stream')
    response['Content-Disposition'] = f'attachment; filename="{os.path.basename(document.document_file.name)}"'
    return response