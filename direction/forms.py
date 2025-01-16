from django import forms
from django.conf import settings
from accounts.models import CustomUser
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from professors.models import Document
from django.utils.text import slugify
import random
import string

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
class AddProfessorForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email']
        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-control'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
        }
        labels = {
            'first_name': 'Prénom',
            'last_name': 'Nom',
            'email': 'Email',
        }
        
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError("Un utilisateur avec cet email existe déjà.")
        return email
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.user_type = 'professor'
        
        # Generate a random password
        random_password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
        user.set_password(random_password)  # Set the randomly generated password

        # Generate a unique username based on  full name
        base_username = slugify(f"{self.cleaned_data['first_name']}_{self.cleaned_data['last_name']}")
        unique_username = base_username
        counter = 1
        while CustomUser.objects.filter(username=unique_username).exists():
            unique_username = f"{base_username}{counter}"
            counter += 1
        user.username = unique_username

        if commit:
            user.save()

        # Attach the randomly generated password to the user instance for later use (e.g., sending emails)
        user.raw_password = random_password

        return user

