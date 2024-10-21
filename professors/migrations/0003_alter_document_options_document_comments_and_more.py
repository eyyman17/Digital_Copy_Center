# Generated by Django 5.1.2 on 2024-10-20 21:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('professors', '0002_document_document_file'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='document',
            options={'ordering': ['-date']},
        ),
        migrations.AddField(
            model_name='document',
            name='comments',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='document',
            name='status',
            field=models.CharField(choices=[('pending', 'En attente'), ('approved', 'Approuvé'), ('rejected', 'Rejeté')], default='pending', max_length=10),
        ),
        migrations.AlterField(
            model_name='document',
            name='document_file',
            field=models.FileField(upload_to='documents/'),
        ),
        migrations.AlterField(
            model_name='document',
            name='n_copies',
            field=models.PositiveIntegerField(),
        ),
    ]