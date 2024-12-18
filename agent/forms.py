from django import forms
from professors.models import Document
from accounts.models import CustomUser

class AgentDocumentForm(forms.ModelForm):
    professeur_name = forms.CharField(
        label="Nom ou Email du Professeur",
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Tapez le nom ou l’email du professeur'})
    )
    professeur_id = forms.CharField(
        widget=forms.HiddenInput()
    )


    def clean(self):
        cleaned_data = super().clean()
        professeur_id = cleaned_data.get("professeur_id")
        
        # Valider si un professeur a bien été sélectionné
        if not professeur_id:
            self.add_error('professeur_name', "Veuillez sélectionner un professeur valide.")
        else:
            try:
                cleaned_data['professeur'] = CustomUser.objects.get(id=professeur_id, user_type='professor')
                
            except CustomUser.DoesNotExist:
                self.add_error('professeur_name', "Professeur non valide.")

        return cleaned_data


    class Meta:
        model = Document
        fields = ['professeur', 'filiere', 'n_copies', 'impression_pour', 
                 'departement', 'format', 'couleur', 'document_file','recto_verso']
        widgets = {
            'impression_pour': forms.Select(attrs={'class': 'form-control'}),
            'departement': forms.Select(attrs={'class': 'form-control'}),
            'format': forms.Select(attrs={'class': 'form-control'}),
            'couleur': forms.Select(attrs={'class': 'form-control'}),
            'filiere': forms.TextInput(attrs={'class': 'form-control'}),
            'recto_verso': forms.Select(attrs={'class': 'form-control'}) ,
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