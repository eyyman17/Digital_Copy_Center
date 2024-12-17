from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .models import Command, Professor
from .forms import ProfessorSearchForm, ProfessorCreateForm, ProfessorDeleteForm
from django.db.models import Q

@login_required
def dashboard(request):
    return render(request, 'dashboard.html')

def dashboard(request):
    professors = Professor.objects.all()  # Récupérer tous les professeurs
    commands = Command.objects.all()      # Récupérer toutes les commandes
    return render(request, 'dashboard.html', {'professors': professors, 'commands': commands})


# View for "liste des commandes"
def command_list(request):
    commands = Command.objects.all()
    return render(request, 'command_list.html', {'commands': commands})

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