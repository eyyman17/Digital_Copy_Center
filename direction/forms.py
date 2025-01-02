from django import forms
from django.conf import settings
from .models import Professor
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from professors.models import Document


# Form for searching professors
class DocumentSearchForm(forms.Form):
    search_query = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Search by professor name...'})
    )
    date_from = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={'class': 'form-control', 'type': 'date'})
    )
    date_to = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={'class': 'form-control', 'type': 'date'})
    )
    status = forms.ChoiceField(
        choices=Document.STATUS_CHOICES + [('', 'Tous')],
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    

# Form for creating a professor
class ProfessorCreateForm(forms.ModelForm):
    class Meta:
        model = Professor
        fields = ['user', 'department']

    user = forms.ModelChoiceField(queryset=get_user_model().objects.filter(is_staff=True))
    department = forms.CharField(max_length=255)

# Form for deleting a professor (simplified)
class ProfessorDeleteForm(forms.Form):
    professor = forms.ModelChoiceField(queryset=Professor.objects.all())


