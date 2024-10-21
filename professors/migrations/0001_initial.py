# Generated by Django 5.1.2 on 2024-10-20 17:35

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('impression_pour', models.CharField(choices=[('Examen', 'Examen'), ('Cours', 'Cours'), ('Document', 'Document')], max_length=10)),
                ('departement', models.CharField(choices=[('Direction', 'Direction'), ('IT', 'IT')], max_length=10)),
                ('filiere', models.CharField(max_length=255)),
                ('n_copies', models.IntegerField()),
                ('format', models.CharField(choices=[('A4', 'A4'), ('A3', 'A3')], max_length=10)),
                ('couleur', models.CharField(choices=[('Blanc/Noir', 'Blanc/Noir'), ('Couleurs', 'Couleurs')], max_length=10)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('professeur', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]