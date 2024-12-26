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
        ("Direction d'Étude", "Direction d'Étude (DE)"),
        ("Direction des Relations d'Entreprises", "Direction des Relations d'Entreprises (DRE)"),
        ("Recherche & Développement", "Recherche & Développement (R&D)"),
        ("Direction des Relations Internationales", "Direction des Relations Internationales (DRI)"),
        ("Laboratoire d'Expertise et de Contrôle", "Laboratoire d'Expertise et de Contrôle (LEC)"),
        ("Career Center", "Career Center (CC)"),
        ("Scolarité", "Scolarité (SC)"),
        ("Administration", "Administration (ADM)"),
        ("IT", "IT"),
        ("Direction Générale", "Direction Générale (DG)"),
    ]
    departement = models.CharField(max_length=50, choices=DEPARTMENT_CHOICES, default="Direction d'Étude")

    DEPARTMENT_ABBREVIATIONS = {
        "Direction d'Étude": "DE",
        "Direction des Relations d'Entreprises": "DRE",
        "Recherche & Développement": "R&D",
        "Direction des Relations Internationales": "DRI",
        "Laboratoire d'Expertise et de Contrôle": "LEC",
        "Career Center": "CC",
        "Scolarité": "SC",
        "Administration": "ADM",
        "IT": "IT",
        "Direction Générale": "DG",
    }

    def get_department_abbreviation(self):
        """Returns the abbreviation for the selected department."""
        return self.DEPARTMENT_ABBREVIATIONS.get(self.departement, self.departement)

    FILIERE_CHOICES = [
        ('Informatique & Management des systèmes', 'Informatique & Management des systèmes (IMS)'),
        ('Génie Industriel Logistique Internationale', 'Génie Industriel Logistique Internationale (GI-LI)'),
        ('Génie Industriel Textile - Habillement', 'Génie Industriel Textile - Habillement (GI-TH)'),
        ('Génie Industriel Chef de Produit', 'Génie Industriel Chef de Produit (GI-CP)'),
        ('Génie Industriel - Tronc commun', 'Génie Industriel - Tronc commun (GI-TC)'),
        ('Ingénierie des Textiles techniques et Intelligents', 'Ingénierie des Textiles techniques et Intelligents (ITTI)'),
        ('Chimie et traitements des matériaux', 'Chimie et traitements des matériaux (CTM)'),
        ('Master Spécialisé Management Produit Textile-Habillement', 'Master Spécialisé Management Produit Textile-Habillement (MS-MPTH)'),
        ('Master Spécialisé E-logistique', 'Master Spécialisé E-logistique (MS-E-Log)'),
        ('Master Spécialisé Distribution et Merchandising', 'Master Spécialisé Distribution et Merchandising (MS-DM)'),
        ('Master Spécialisé Hygiène, Sécurité Et Environnement', 'Master Spécialisé Hygiène, Sécurité Et Environnement (MS-HSE)'),
        ('Licence Professionnelle Développement En Habillement', 'Licence Professionnelle Développement En Habillement (LP-DH)'),
        ('Licence Professionnelle Gestion De Production En Habillement', 'Licence Professionnelle Gestion De Production En Habillement (LP-GPH)'),
        ('Licence Professionnelle Gestion De Production Textile', 'Licence Professionnelle Gestion De Production Textile (LP-GPT)'),
        ('Licence Professionnelle Gestion De La Chaine Logistique', 'Licence Professionnelle Gestion De La Chaine Logistique (LP-GCL)'),
        ('Licence Professionnelle Gestion Achat & Sourcing', 'Licence Professionnelle Gestion Achat & Sourcing (LP-GAS)'),
        ('Cycle Technicien Spécialisé', 'Cycle Technicien Spécialisé (CTS)'),
        ('RSA (Rien à signaler)', 'RSA (Rien à signaler)'),
    ]
    
    filiere = models.CharField(max_length=255, choices=FILIERE_CHOICES)

    FILIERE_ABBREVIATIONS = {
        'Informatique & Management des systèmes': 'IMS',
        'Génie Industriel Logistique Internationale': 'GI-LI',
        'Génie Industriel Textile - Habillement': 'GI-TH',
        'Génie Industriel Chef de Produit': 'GI-CP',
        'Génie Industriel - Tronc commun': 'GI-TC',
        'Ingénierie des Textiles techniques et Intelligents': 'ITTI',
        'Chimie et traitements des matériaux': 'CTM',
        'Master Spécialisé Management Produit Textile-Habillement': 'MS-MPTH',
        'Master Spécialisé E-logistique': 'MS-E-Log',
        'Master Spécialisé Distribution et Merchandising': 'MS-DM',
        'Master Spécialisé Hygiène, Sécurité Et Environnement': 'MS-HSE',
        'Licence Professionnelle Développement En Habillement': 'LP-DH',
        'Licence Professionnelle Gestion De Production En Habillement': 'LP-GPH',
        'Licence Professionnelle Gestion De Production Textile': 'LP-GPT',
        'Licence Professionnelle Gestion De La Chaine Logistique': 'LP-GCL',
        'Licence Professionnelle Gestion Achat & Sourcing': 'LP-GAS',
        'Cycle Technicien Spécialisé': 'CTS',
        'RSA (Rien à signaler)': 'RSA',
    }

    def get_filiere_abbreviation(self):
        """Returns the abbreviation for the selected filiere."""
        return self.FILIERE_ABBREVIATIONS.get(self.filiere, self.filiere)


    n_copies = models.IntegerField(default=1)


    FORMAT_CHOICES = [
        ('A4', 'A4'),
        ('A3', 'A3'),
    ]
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default='Blanc/Noir')

    COLOR_CHOICES = [
        ('Blanc/Noir', 'Blanc/Noir'),
        ('Couleurs', 'Couleurs'),
    ]
    couleur = models.CharField(max_length=10, choices=COLOR_CHOICES, default='Blanc/Noir')

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
    