from django import forms
from django.conf import settings
from .models import Professor
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

# Form for searching professors
class ProfessorSearchForm(forms.Form):
    search_query = forms.CharField(max_length=255, required=False)

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


class DocumentSearchForm(forms.Form):
    search_query = forms.CharField(required=False, label='Search by Name')
    date_from = forms.DateField(required=False, widget=forms.DateInput(attrs={'type': 'date'}), label='From Date')
    date_to = forms.DateField(required=False, widget=forms.DateInput(attrs={'type': 'date'}), label='To Date')
    status = forms.ChoiceField(
        choices=[('', 'All'), ('en_attente', 'En Attente'), ('approuve', 'Approuvé'), ('refuse', 'Refusé')],
        required=False,
        label='Status'
    )