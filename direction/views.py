from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from .forms import AddProfessorForm
from django.db.models import Q
from django.core.paginator import Paginator
from professors.models import Document 
from accounts.models import CustomUser

from django.contrib import messages

from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.http import JsonResponse


from django.utils import timezone
from datetime import timedelta


from django.core.mail import send_mail, BadHeaderError



def is_direction(user):
    return user.is_authenticated and user.user_type == 'direction'

@login_required
@user_passes_test(is_direction)
def dashboard(request):
    return render(request, 'dashboard.html')


@login_required
@user_passes_test(is_direction)
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
def professors_list(request):
    """
    API endpoint to retrieve the list of professors for the direction dashboard.
    Supports filtering by search query and pagination.
    """
    professors = CustomUser.objects.filter(user_type='professor').order_by('last_name')
    search_query = request.GET.get('search_query', '')
    page = request.GET.get('page', 1)
    rows_per_page = 10

    # Apply search filters
    if search_query:
        professors = professors.filter(
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query)
        )

    # Paginate results
    paginator = Paginator(professors, rows_per_page)
    paginated_professors = paginator.get_page(page)

    # Serialize professors for JSON response
    professors_data = [
        {
            "id": professor.id,
            "first_name": professor.first_name,
            "last_name": professor.last_name,
            "email": professor.email,
        }
        for professor in paginated_professors
    ]

    return JsonResponse({
        "professors": professors_data,
        "current_page": paginated_professors.number,
        "total_pages": paginator.num_pages,
    })

import json


from django.db import transaction 

@login_required
@user_passes_test(is_direction)
def add_professor(request):
    if request.method == 'POST':
        try:
            # Parse the JSON payload
            data = json.loads(request.body)

            # Use Django's transaction.atomic to ensure atomicity
            with transaction.atomic():
                # Validate data using the AddProfessorForm
                form = AddProfessorForm(data)
                if form.is_valid():
                    # Step 1: Save the user but don't commit the transaction yet
                    user = form.save(commit=True)  # User will not be persisted if anything goes wrong
                    random_password = user.raw_password  # Get the generated password

                    # Step 2: Attempt to send the email
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
                    except (BadHeaderError, Exception) as e:
                        # If email fails, raise an exception to trigger a rollback
                        raise Exception("Email sending failed: " + str(e))

                    # Step 3: If the email is sent successfully, commit the transaction
                    return JsonResponse(
                        {"message": "Professeur ajouté avec succès !"},
                        status=201
                    )
                else:
                    # If the form is invalid, return form validation errors
                    return JsonResponse(
                        {"errors": form.errors},
                        status=400
                    )
        except json.JSONDecodeError:
            return JsonResponse(
                {"errors": {"global": "Invalid JSON payload."}},
                status=400
            )
        except Exception as e:
            # Catch all other exceptions (e.g., email errors, transaction errors)
            return JsonResponse(
                {"errors": {"global": f"Une erreur est survenue: {str(e)}"}},
                status=500
            )

    return JsonResponse({"errors": {"global": "Invalid HTTP method."}}, status=405)


from django.views.decorators.http import require_http_methods

@login_required
@user_passes_test(is_direction)
@require_http_methods(["DELETE"])
def delete_professor(request, professor_id):
    """
    View to handle the deletion of a professor by ID.
    Accepts only DELETE requests from users with 'direction' access.
    """
    try:
        # Fetch the professor object (only user_type 'professor' allowed)
        professor = get_object_or_404(CustomUser, id=professor_id, user_type='professor')
        
        # Delete the professor
        professor.delete()
        
        # Return success response
        return JsonResponse({
            "success": True,
            "message": "Professeur supprimé avec succès."
        }, status=200)
    except CustomUser.DoesNotExist:
        # Handle case where the professor doesn't exist
        return JsonResponse({
            "success": False,
            "message": "Le professeur n'existe pas."
        }, status=404)
    except Exception as e:
        # Handle unexpected errors
        return JsonResponse({
            "success": False,
            "message": f"Une erreur s'est produite : {str(e)}"
        }, status=500)