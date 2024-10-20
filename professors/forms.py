from django import forms
from .models import Document


class DocumentForm(forms.ModelForm):
    professeur_display = forms.CharField(label='Professeur', required=False)  # Read-only field for display
    class Meta:
        model = Document
        fields = ['filiere', 'n_copies', 'impression_pour', 'departement', 'format', 'couleur']
        widgets = {
            'impression_pour': forms.Select(),
            'departement': forms.Select(),
            'format': forms.Select(),
            'couleur': forms.Select(),
        }
    def __init__(self, *args, **kwargs):
        # Pass the logged-in user to the form
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        # Set the display field value to the user's name if user is provided
        if self.user:
            self.fields['professeur_display'].initial = f"{self.user.first_name} {self.user.last_name}" if self.user.first_name or self.user.last_name else self.user.username  # Adjust format
            self.fields['professeur_display'].widget.attrs['readonly'] = True  # Make it read-only
        
        self.fields['format'].choices = [('A4', 'A4'), ('A3', 'A3')]        # Restrict options to A4 and A3
        self.fields['format'].initial = 'A4'                                # Set A4 as the default
        self.fields['format'].required = True 

        self.fields['couleur'].choices =[('Blanc/Noir', 'Blanc/Noir'),('Couleurs', 'Couleurs')]       # Restrict options to A4 and A3
        self.fields['couleur'].initial = 'Blanc/Noir'                                # Set Blanc/Noir as the default
        self.fields['couleur'].required = True 

        self.fields['n_copies'].initial = 1
        