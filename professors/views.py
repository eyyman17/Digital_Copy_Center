from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import DocumentForm
from .models import Document


@login_required
def history(request):
    documents = Document.objects.filter(professeur=request.user)
    return render(request, 'docs_list.html', {'documents': documents})

@login_required
def submit_document(request):
    if request.method == 'POST':
        form = DocumentForm(request.POST, user=request.user)  # Pass the logged-in user
        if form.is_valid():
            document = form.save(commit=False)
            document.professeur = request.user  # Assign the logged-in user
            document.save()
            return redirect('professor_history')
    else:
        form = DocumentForm(user=request.user)  # Pass the logged-in user
    return render(request, 'submit_document.html', {'form': form})


