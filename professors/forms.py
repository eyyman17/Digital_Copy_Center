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
                 'format', 'couleur', 'document_file']
        widgets = {
            'impression_pour': forms.Select(attrs={'class': 'form-control'}),
            'departement': forms.Select(attrs={'class': 'form-control'}),
            'format': forms.Select(attrs={'class': 'form-control'}),
            'couleur': forms.Select(attrs={'class': 'form-control'}),
            'filiere': forms.TextInput(attrs={'class': 'form-control'}),
            'n_copies': forms.NumberInput(attrs={'class': 'form-control', 'min': '1'}),
        }

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        
        if self.user:
            self.fields['professeur_display'].initial = (
                f"{self.user.first_name} {self.user.last_name}"
                if self.user.first_name or self.user.last_name
                else self.user.username
            )

        self.fields['format'].initial = 'A4'
        self.fields['couleur'].initial = 'Blanc/Noir'
        self.fields['n_copies'].initial = 1

    def clean_n_copies(self):
        n_copies = self.cleaned_data.get('n_copies')
        if n_copies < 1:
            raise forms.ValidationError("Le nombre de copies doit être au moins 1")
        return n_copies