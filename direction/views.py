from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from .forms import AddProfessorForm
from django.db.models import Q
from django.core.paginator import Paginator
from professors.models import Document 
from .forms import DocumentSearchForm  
from accounts.models import CustomUser

from django.contrib import messages

from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.http import JsonResponse



from django.core.mail import send_mail, BadHeaderError



def is_direction(user):
    return user.is_authenticated and user.user_type == 'direction'

@login_required
@user_passes_test(is_direction)
def dashboard(request):
    return render(request, 'dashboard.html')


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
def download_document(request, doc_id):
    document = get_object_or_404(Document, id=doc_id)
    response = HttpResponse(document.document_file, content_type='application/octet-stream')
    response['Content-Disposition'] = f'attachment; filename="{document.document_file.name}"'
    return response


    
    
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
    professors = CustomUser.objects.filter(user_type='professor')
    return render(request, 'professor_list.html', {'professors': professors})




@login_required
@user_passes_test(is_direction)
def add_professor(request):
    if request.method == 'POST':
        form = AddProfessorForm(request.POST)
        if form.is_valid():
            try:
                # Step 1: Save user with form logic
                user = form.save(commit=True)  # The password and username are set in the form's save() method
                random_password = user.raw_password  # Access the generated password from the form's save()

                # Step 2: Send email with credentials
                try:
                    send_mail(
                        subject='[ESITH CENTRE COPIE] Votre compte a été créé avec succès !',
                        message=f"""
                            Bonjour {user.first_name},

                            Votre compte a été créé avec succès. Vous pouvez vous connecter avec les informations suivantes :

                            Email : {user.email}
                            Mot de passe : {random_password}

                            Si vous le souhaitez, vous avez la possibilité de modifier votre mot de passe en cliquant sur "Mot de passe oublié" depuis la page de connexion.

                            Merci de votre confiance.
                            
                            Cordialement,
                            L'équipe du Centre de Copie Numérique de l'ESITH.
                        """,
                        from_email='noreply@example.com',
                        recipient_list=[user.email],
                        html_message=f"""
                            <html>
                            <body>
                                <p>Bonjour {user.first_name},</p>
                                <p>Votre compte a été créé avec succès. Vous pouvez vous connecter avec les informations suivantes :</p>
                                <ul>
                                    <li><strong>Email :</strong> {user.email}</li>
                                    <li><strong>Mot de passe :</strong> {random_password}</li>
                                </ul>
                                <p>Si vous le souhaitez, vous avez la possibilité de modifier votre mot de passe en cliquant sur <strong>"Mot de passe oublié"</strong> depuis la page de connexion.</p>
                                <p>Merci de votre confiance.</p>
                                <p>Cordialement,<br><strong>ESITH Centre De Copie</strong></p>
                            </body>
                            </html>
                        """
                    )
                    print("Email sent successfully.")
                    messages.success(request, "Le professeur a été ajouté avec succès! Un email contenant le mot de passe a été envoyé.")
                except (BadHeaderError, Exception) as e:
                    print(f"Error sending email: {e}")
                    messages.error(request, "Erreur lors de l'envoi de l'email au professeur. Veuillez réessayer.")

                # Step 3: Redirect to professor list
                return redirect('direction:professor_list')

            except Exception as e:
                print(f"Error during professor creation: {e}")
                messages.error(request, "Une erreur est survenue lors de la création du professeur.")
        else:
            print(f"Form errors: {form.errors}")
            messages.error(request, "Erreur lors de l'ajout du professeur.")
    else:
        form = AddProfessorForm()
    
    return render(request, 'professor_add.html', {'form': form})



@login_required
@user_passes_test(is_direction)
def delete_professor(request, professor_id):
    
    if request.method == "DELETE" or (request.method == "POST" and request.POST.get('_method') == 'DELETE'):
        professor = get_object_or_404(CustomUser, id=professor_id, user_type='professor')
        professor.delete()
        return JsonResponse({"success": True, "message": "Professor deleted successfully."})
    return JsonResponse({"success": False, "message": "Invalid request method."}, status=400)