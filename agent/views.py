from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from .forms import AgentDocumentForm, DocumentSearchForm
from professors.models import Document
from .models import AgentSubmission
from django.core.paginator import Paginator
from django.db.models import Q
import uuid
from django.http import HttpResponse
from django.utils import timezone

from django.http import JsonResponse
from django.db.models import Q
from accounts.models import CustomUser

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

        if search_query:
            documents = documents.filter(
                Q(professeur__first_name__icontains=search_query) |
                Q(professeur__last_name__icontains=search_query)
            )
        
        if date_from:
            documents = documents.filter(date__gte=date_from)
        if date_to:
            documents = documents.filter(date__lte=date_to)

        print("Documents in dashboard:")
        for doc in documents:
            print(f"Document ID: {doc.id}, Status: {doc.validation_impression}")


        # Apply status filter only if it's non-empty
        if status and status in dict(Document.STATUS_CHOICES):
            documents = documents.filter(validation_impression=status)

    paginator = Paginator(documents, 10)
    page = request.GET.get('page')
    documents = paginator.get_page(page)

    return render(request, 'agent_dashboard.html', {
        'documents': documents,
        'search_form': search_form
    })

@login_required
@user_passes_test(is_agent)
def agent_submit(request):
    if request.method == 'POST':
        form = AgentDocumentForm(request.POST, request.FILES)
        if form.is_valid():
            print("DEBUG: Form is valid")
        else:
            print("DEBUG: Form is invalid:", form.errors)
        if form.is_valid():
            document = form.save(commit=False)
            document.professeur = form.cleaned_data['professeur']
            document.save()
            
            # Create agent submission record
            submission = AgentSubmission.objects.create(
                document=document,
                submitted_by=request.user,
                approval_token=str(uuid.uuid4())
            )
            
            # Try sending an approval email to the professor
            try:
                submission.send_approval_email()
                messages.success(request, 'Document submitted successfully. Awaiting professor approval.')
            except Exception as e:
                messages.error(request, f'Document submitted, but approval email failed to send: {e}')
            
            return redirect('agent:agent_dashboard')
    else:
        form = AgentDocumentForm()
    
    return render(request, 'submit_doc_agent.html', {'form': form})

from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages

@login_required
@user_passes_test(is_agent)
def approve_document(request, doc_id):
    document = get_object_or_404(Document, id=doc_id)
    submission = AgentSubmission.objects.filter(document=document).first()
    
    # Check if professor approval is required
    if submission and not submission.is_approved_by_professor:
        messages.error(request, 'This document requires professor approval first.')
    else:
        document.validation_impression = 'approuve'
        document.save()
        messages.success(request, 'Document approved successfully.')

    return redirect('agent:agent_dashboard')


def professor_approval(request, token):
    submission = get_object_or_404(AgentSubmission, approval_token=token)
    
    if not submission.is_approved_by_professor:
        submission.is_approved_by_professor = True
        submission.document.validation_impression = 'approuve'
        submission.document.save()
        submission.save()
        messages.success(request, 'Document approved successfully.')
    else:
        messages.info(request, 'This document has already been approved.')

    return redirect('professors:professor_history')


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