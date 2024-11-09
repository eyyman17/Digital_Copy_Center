# Generated by Django 5.1.2 on 2024-10-22 13:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('professors', '0004_alter_document_options_remove_document_comments_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='validation_impression',
            field=models.CharField(choices=[('en_attente', 'En attente'), ('approuve', 'Approuvé')], default='en_attente', max_length=20),
        ),
    ]