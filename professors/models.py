from django.db import models
from accounts.models import CustomUser
import random


class Document(models.Model):
    
    STATUS_CHOICES = [
        ('en_attente', 'En attente'),
        ('imprimé', 'Imprimé'),
        ('recupéré', 'Recupéré'),
    ]
    validation_impression = models.CharField(max_length=20, choices=STATUS_CHOICES, default='en_attente')

    IMPRESSION_CHOICES = [
        ('Examen', 'Examen'),
        ('Cours', 'Cours'),
        ('Document', 'Document'),
    ]
    impression_pour = models.CharField(max_length=10, choices=IMPRESSION_CHOICES)

    DEPARTMENT_CHOICES = [
        ('Direction', 'Direction'),
        ('IT', 'IT'),
    ]
    departement = models.CharField(max_length=10, choices=DEPARTMENT_CHOICES)


    filiere = models.CharField(max_length=255)

    n_copies = models.IntegerField()


    FORMAT_CHOICES = [
        ('A4', 'A4'),
        ('A3', 'A3'),
    ]
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES)

    COLOR_CHOICES = [
        ('Blanc/Noir', 'Blanc/Noir'),
        ('Couleurs', 'Couleurs'),
    ]
    couleur = models.CharField(max_length=10, choices=COLOR_CHOICES)

    RECTO_VERSO_CHOICES = [
        ('recto', 'Recto'),
        ('recto-verso', 'Recto-Verso'),
    ]
    recto_verso = models.CharField(max_length=20, choices=RECTO_VERSO_CHOICES, default='recto')



    professeur = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    document_file = models.FileField(upload_to='documents/')
    date = models.DateTimeField(auto_now_add=True)

    #Code_validation_for_the_agent:
    code_validation = models.CharField(max_length=4, blank=True, null=True)

    def generate_code(self):
        self.code_validation = f"{random.randint(1000, 9999)}"
        self.save()


    # String Representation
    def __str__(self):
        return f"{self.professeur.username} - {self.document_file.name}"
    