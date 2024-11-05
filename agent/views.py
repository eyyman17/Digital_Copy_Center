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

def is_agent(user):
    return user.is_authenticated and user.is_agent

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
        if status:
            documents = documents.filter(validation_impression=status)

    paginator = Paginator(documents, 10)
    page = request.GET.get('page')
    documents = paginator.get_page(page)

    return render(request, 'agent/agent_dashboard.html', {
        'documents': documents,
        'search_form': search_form
    })

@login_required
@user_passes_test(is_agent)
def agent_submit(request):
    if request.method == 'POST':
        form = AgentDocumentForm(request.POST, request.FILES)
        if form.is_valid():
            document = form.save(commit=False)
            document.save()
            
            # Create agent submission record
            submission = AgentSubmission.objects.create(
                document=document,
                submitted_by=request.user,
                approval_token=str(uuid.uuid4())
            )
            
            # Send approval email to professor
            submission.send_approval_email()
            
            messages.success(request, 'Document submitted successfully. Awaiting professor approval.')
            return redirect('agent:agent_dashboard')
    else:
        form = AgentDocumentForm()
    
    return render(request, 'agent/submit.html', {'form': form})

@login_required
@user_passes_test(is_agent)
def approve_document(request, doc_id):
    document = get_object_or_404(Document, id=doc_id)
    if not hasattr(document, 'agentsubmission'):
        document.validation_impression = 'approuve'
        document.save()
        messages.success(request, 'Document approved successfully.')
    else:
        messages.error(request, 'This document requires professor approval first.')
    return redirect('agent:agent_dashboard')

def professor_approval(request, token):
    submission = get_object_or_404(AgentSubmission, approval_token=token)
    
    if not submission.is_approved_by_professor:
        submission.is_approved_by_professor = True
        submission.document.validation_impression = 'approuve'
        submission.document.save()
        submission.save()
        messages.success(request, 'Document approved successfully.')
    
    return redirect('professors:professor_history')

@login_required
@user_passes_test(is_agent)
def download_document(request, doc_id):
    document = get_object_or_404(Document, id=doc_id)
    response = HttpResponse(document.document_file, content_type='application/octet-stream')
    response['Content-Disposition'] = f'attachment; filename="{document.document_file.name}"'
    return response