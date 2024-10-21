from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import DocumentForm
from .models import Document

@login_required
def professor_history(request):
    documents = Document.objects.filter(professeur=request.user).order_by('-date') 
    return render(request, 'docs_list.html', {'documents': documents})

@login_required
def submit_document(request):
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES, user=request.user)
        if form.is_valid():
            document = form.save(commit=False)
            document.professeur = request.user
            document.save()
            messages.success(request, 'Document soumis avec succès!')
            return redirect('/professors/history/')
        else:
            messages.error(request, 'Erreur lors de la soumission du document.')
    else:
        form = DocumentForm(user=request.user)
    
    return render(request, 'submit_document.html', {'form': form})