from django import forms
from .models import Document

class DocumentForm(forms.ModelForm):
    professeur_display = forms.CharField(
        label='Professeur',
        required=False,
        widget=forms.TextInput(attrs={'readonly': 'readonly'})
    )

    class Meta:
        model = Document
        fields = ['filiere', 'n_copies', 'impression_pour', 'departement', 
                 'format','recto_verso', 'couleur', 'document_file']
        widgets = {
            'impression_pour': forms.Select(attrs={'class': 'form-control'}),
            'departement': forms.Select(attrs={'class': 'form-control'}),
            'format': forms.Select(attrs={'class': 'form-control'}),
            'couleur': forms.Select(attrs={'class': 'form-control'}),
            'filiere': forms.Select(attrs={'class': 'form-control'}),
            'recto_verso': forms.Select(attrs={'class': 'form-control'}) ,
            'n_copies': forms.NumberInput(attrs={'class': 'form-control', 'min': '1'}),
        }

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        self.fields['document_file'].required = True
        
        if self.user:
            self.fields['professeur_display'].initial = (
                f"{self.user.first_name} {self.user.last_name}"
                if self.user.first_name or self.user.last_name
                else self.user.username
            )