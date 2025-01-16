from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from .forms import DocumentSearchForm
from professors.models import Document
from django.core.paginator import Paginator
from django.db.models import Q

from django.http import HttpResponse
from django.http import JsonResponse
from django.db.models import Q
from accounts.models import CustomUser

from django.core.mail import send_mail, BadHeaderError

from django.utils import timezone
from datetime import timedelta


def is_agent(user):
    return user.is_authenticated and user.user_type == 'agent'

@login_required
@user_passes_test(is_agent)
def agent_dashboard(request):
    search_form = DocumentSearchForm(request.GET)
    documents = Document.objects.all().order_by('-date')

    if search_form.is_valid():
        search_query = search_form.cleaned_data.get('search_query')
        date_from = search_form.cleaned_data.get('date_from')
        date_to = search_form.cleaned_data.get('date_to')
        status = search_form.cleaned_data.get('status')

        # Filter by professor's unique email or full name
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

        # Apply status filter only if it's non-empty
        if status and status in dict(Document.STATUS_CHOICES):
            documents = documents.filter(validation_impression=status)

    for document in documents:
        document.is_downloadable = (timezone.now() - document.date) <= timedelta(days=7)

    paginator = Paginator(documents, 10)
    page = request.GET.get('page')
    documents = paginator.get_page(page)

    return render(request, 'agent_dashboard.html', {
        'documents': documents,
        'search_form': search_form
    })

@login_required
@user_passes_test(is_agent)
def download_document(request, doc_id):
    document = get_object_or_404(Document, id=doc_id)
    response = HttpResponse(document.document_file, content_type='application/octet-stream')
    response['Content-Disposition'] = f'attachment; filename="{document.document_file.name}"'
    return response



@login_required
@user_passes_test(is_agent)
def search_professor(request):
    query = request.GET.get('q', '')
    results = []
    if query:
        results = CustomUser.objects.filter(
            Q(first_name__icontains=query) | Q(last_name__icontains=query) | Q(email__icontains=query),
            user_type='professor'
        ).values('id', 'first_name', 'last_name', 'email')[:10]

    return JsonResponse(list(results), safe=False)




from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from professors.models import Document
import os

@login_required
@user_passes_test(is_agent)
def mark_as_printed(request, document_id):
    document = get_object_or_404(Document, id=document_id)
    
    if request.method == "POST" and request.headers.get("X-Requested-With") == "XMLHttpRequest":
        document.generate_code()
        
        # Try sending the email
        try:
            send_mail(
                subject='Document prêt à être récupéré',
                message=f"""
                    Bonjour {document.professeur.first_name},

                    Votre document '{os.path.basename(document.document_file.name)}' a été imprimé et est prêt à être récupéré.

                    Code de retrait : {document.code_validation}

                    Veuillez présenter ce code à l'agent au moment de la récupération de votre document.

                    Merci de votre confiance.
                    Cordialement,
                    L'équipe du centre de copie numérique.
                """,
                from_email='noreply@example.com',
                recipient_list=[document.professeur.email],
                html_message=f"""
                    <html>
                    <body>
                        <p>Bonjour {document.professeur.first_name},</p>
                        <p>Votre document '<strong>{os.path.basename(document.document_file.name)}</strong>' a été imprimé et est prêt à être récupéré.</p>
                        <p><strong style="font-size: 14px;">Code de retrait :</strong> <strong style="font-size: 18px;">{document.code_validation}</strong></p>
                        <p><strong style="font-size: 14px;">Veuillez présenter ce code à l'agent au moment de la récupération de votre document.</strong>
                        <p>Merci de votre confiance.</p>
                        <p>Cordialement,<br>ESITH Centre De Copie</p>
                    </body>
                    </html>
                """
            )
        except (BadHeaderError, Exception) as e:
            # If email fails, return an error response
            return JsonResponse({
                "success": False,
                "error": "Failed to send email. Please try again."
            })

        # Only mark as "imprimé" if the email is sent successfully
        document.validation_impression = 'imprimé'
        document.save()
        return JsonResponse({
            "success": True,
            "old_status": "en_attente",
            "new_status": "imprimé",
            "new_status_label": "Imprimé"
        })
    return JsonResponse({"success": False, "error": "Invalid request."})

@login_required
@user_passes_test(is_agent)
def validate_and_mark_recupere(request, document_id):
    document = get_object_or_404(Document, id=document_id)
    if request.method == "POST" and request.headers.get("X-Requested-With") == "XMLHttpRequest":
        input_code = request.POST.get("validation_code")
        if input_code == document.code_validation:
            document.validation_impression = 'recupéré'
            document.save()
            return JsonResponse({
                "success": True,
                "old_status": "imprimé",
                "new_status": "recupéré",
                "new_status_label": "Récupéré"
            })
        else:
            return JsonResponse({"success": False, "error": "Invalid validation code."})

    return JsonResponse({"success": False, "error": "Invalid request."})