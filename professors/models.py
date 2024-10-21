from django.db import models
from accounts.models import CustomUser

class Document(models.Model):
    STATUS_CHOICES = [
        ('en_attente', 'En attente'),
        ('approuve', 'Approuvé'),
        ('refuse', 'Refusé')
    ]
    
    professeur = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    
    impression_pour = models.CharField(max_length=10, choices=[
        ('Examen', 'Examen'),
        ('Cours', 'Cours'),
        ('Document', 'Document'),
    ])
    departement = models.CharField(max_length=10, choices=[
        ('Direction', 'Direction'),
        ('IT', 'IT'),
    ])
    filiere = models.CharField(max_length=255)
    n_copies = models.IntegerField()
    format = models.CharField(max_length=10, choices=[
        ('A4', 'A4'),
        ('A3', 'A3'),
    ])
    couleur = models.CharField(max_length=10, choices=[
        ('Blanc/Noir', 'Blanc/Noir'),
        ('Couleurs', 'Couleurs'),
    ])
    date = models.DateTimeField(auto_now_add=True)
    document_file = models.FileField(upload_to='documents/')
    validation_impression = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='en_attente'
    )

    def __str__(self):
        return f"{self.filiere} - {self.n_copies} copies"