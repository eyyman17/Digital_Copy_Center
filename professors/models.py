from django.db import models
from accounts.models import CustomUser


class Document(models.Model):
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
    format =models.CharField(max_length=10, choices=[
        ('A4', 'A4'),
        ('A3', 'A3'),
    ])
    couleur =  models.CharField(max_length=10, choices=[
        ('Blanc/Noir', 'Blanc/Noir'),
        ('Couleurs', 'Couleurs'),
    ])
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.filiere} - {self.n_copies} copies, Format: {self.format}, Couleur: {self.couleur}, Submitted on: {self.date}"



