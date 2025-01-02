from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render, redirect
from .models import Professor
from .forms import ProfessorCreateForm, ProfessorDeleteForm
from django.db.models import Q
from django.core.paginator import Paginator
from professors.models import Document 
from .forms import DocumentSearchForm  
from accounts.models import CustomUser

from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.http import JsonResponse



def is_direction(user):
    return user.is_authenticated and user.user_type == 'direction'

@login_required
@user_passes_test(is_direction)
def dashboard(request):
    return render(request, 'dashboard.html')

def dashboard(request):
    professors = Professor.objects.all()  # Récupérer tous les professeurs
    return render(request, 'dashboard.html', {'professors': professors})


@login_required
@user_passes_test(is_direction)
def command_list(request):
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


    paginator = Paginator(documents, 10)
    page = request.GET.get('page')
    documents = paginator.get_page(page)

    return render(request, 'command_list.html', {
        'documents': documents,
        'search_form': search_form
    })
    
    
    
@login_required
@user_passes_test(is_direction)
def search_professor(request):
    query = request.GET.get('q', '')
    results = []
    if query:
        results = CustomUser.objects.filter(
            Q(first_name__icontains=query) | Q(last_name__icontains=query) | Q(email__icontains=query),
            user_type='professor'
        ).values('id', 'first_name', 'last_name', 'email')[:10]

    return JsonResponse(list(results), safe=False)




@login_required
@user_passes_test(is_direction)
def professor_list(request):
    query = request.GET.get('q', '')
    results = []
    if query:
        results = CustomUser.objects.filter(
            Q(first_name__icontains=query) | Q(last_name__icontains=query) | Q(email__icontains=query),
            user_type='professor'
        ).values('id', 'first_name', 'last_name', 'email')[:10]
    return render(request, 'professor_list.html')


@login_required
@user_passes_test(is_direction)
def professor_create(request):
    if request.method == 'POST':
        form = ProfessorCreateForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('direction:professor_list')
    else:
        form = ProfessorCreateForm()
    
    return render(request, 'professor_create.html', {'form': form})


@login_required
@user_passes_test(is_direction)
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



@login_required
@user_passes_test(is_direction)
def download_document(request, doc_id):
    document = get_object_or_404(Document, id=doc_id)
    response = HttpResponse(document.document_file, content_type='application/octet-stream')
    response['Content-Disposition'] = f'attachment; filename="{document.document_file.name}"'
    return response