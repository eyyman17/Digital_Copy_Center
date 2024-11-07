from django import forms
from professors.models import Document
from accounts.models import CustomUser

class AgentDocumentForm(forms.ModelForm):
    professeur = forms.ModelChoiceField(
        queryset=CustomUser.objects.filter(user_type='professor'),
        empty_label="Select Professor",
        widget=forms.Select(attrs={'class': 'form-control'})
    )

    class Meta:
        model = Document
        fields = ['professeur', 'filiere', 'n_copies', 'impression_pour', 
                 'departement', 'format', 'couleur', 'document_file']
        widgets = {
            'impression_pour': forms.Select(attrs={'class': 'form-control'}),
            'departement': forms.Select(attrs={'class': 'form-control'}),
            'format': forms.Select(attrs={'class': 'form-control'}),
            'couleur': forms.Select(attrs={'class': 'form-control'}),
            'filiere': forms.TextInput(attrs={'class': 'form-control'}),
            'n_copies': forms.NumberInput(attrs={'class': 'form-control', 'min': '1'}),
        }

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
        choices=[('', 'All')] + Document.STATUS_CHOICES,
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'})
    )