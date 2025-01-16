from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .models import Command, Professor
from .forms import ProfessorSearchForm, ProfessorCreateForm, ProfessorDeleteForm
from django.db.models import Q
from django.core.paginator import Paginator
from professors.models import Document 
from .forms import DocumentSearchForm  # Assuming you have a form for filtering the documents
from django.db.models import Count
from datetime import datetime
"""from rest_framework.views import APIView
from rest_framework.response import Response
from .utils import get_trend_data"""
import json



@login_required
def dashboard(request):
    return render(request, 'dashboard.html')

def dashboard(request):
    professors = Professor.objects.all()  # Récupérer tous les professeurs
    commands = Command.objects.all()      # Récupérer toutes les commandes
    return render(request, 'dashboard.html', {'professors': professors, 'commands': commands})


# View for "liste des commandes"
def command_list(request):
    # Get all documents, or filter based on search criteria
    documents = Document.objects.all()

    # Apply search filters if present in GET parameters
    search_query = request.GET.get('search_query', '')
    date_from = request.GET.get('date_from', '')
    date_to = request.GET.get('date_to', '')
    status = request.GET.get('status', '')

    # Apply filtering based on the form inputs
    if search_query:
        documents = documents.filter(document_file__icontains=search_query)
    if date_from:
        documents = documents.filter(date__gte=date_from)
    if date_to:
        documents = documents.filter(date__lte=date_to)
    if status:
        documents = documents.filter(validation_impression=status)

    # Paginate the results
    paginator = Paginator(documents, 10)  # Show 10 documents per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Pass the documents and form to the template
    context = {
        'documents': page_obj,
        'search_form': DocumentSearchForm(request.GET),
    }
    return render(request, 'command_list.html', context)

# View for "liste des professeurs"
def professor_list(request):
    form = ProfessorSearchForm(request.GET or None)
    professors = Professor.objects.all()

    if form.is_valid():
        search_query = form.cleaned_data.get('search_query')
        if search_query:
            professors = professors.filter(
                Q(user__first_name__icontains=search_query) | Q(user__last_name__icontains=search_query) |
                Q(user__email__icontains=search_query)
            )

    return render(request, 'professor_list.html', {'professors': professors, 'form': form})

# View for "creer/supprimer un professeur"
def professor_create(request):
    if request.method == 'POST':
        form = ProfessorCreateForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('direction:professor_list')
    else:
        form = ProfessorCreateForm()
    
    return render(request, 'professor_create.html', {'form': form})

# View for deleting a professor
def professor_delete(request):
    if request.method == 'POST':
        form = ProfessorDeleteForm(request.POST)
        if form.is_valid():
            professor = form.cleaned_data['professor']
            professor.delete()
            return redirect('direction:professor_list')
    else:
        form = ProfessorDeleteForm()

    return render(request, 'professor_delete.html', {'form': form})


def download_document(request, doc_id):
    document = get_object_or_404(Document, id=doc_id)
    response = HttpResponse(document.document_file, content_type='application/octet-stream')
    response['Content-Disposition'] = f'attachment; filename="{document.document_file.name}"'
    return response



def dashboard(request):
    # Compter les commandes selon leur statut
    total_commandes = Command.objects.count()
    commandes_en_attente = Command.objects.filter(status='en_attente').count()
    commandes_validees = Command.objects.filter(status='validee').count()
    
    
    # Envoyer les données au template
    context = {
        'total_commandes': total_commandes,
        'commandes_en_attente': commandes_en_attente,
        'commandes_validees': commandes_validees,
        
    }

    return render(request, 'dashboard.html', context)

    

"""class TrendDataAPIView(APIView):
    def get(self, request):
        trend_data = get_trend_data()
        return Response(trend_data)
    """
