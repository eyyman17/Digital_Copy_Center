# Generated by Django 5.1.2 on 2024-10-20 21:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('professors', '0003_alter_document_options_document_comments_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='document',
            options={},
        ),
        migrations.RemoveField(
            model_name='document',
            name='comments',
        ),
        migrations.RemoveField(
            model_name='document',
            name='status',
        ),
        migrations.AddField(
            model_name='document',
            name='validation_impression',
            field=models.CharField(choices=[('en_attente', 'En attente'), ('approuve', 'Approuvé'), ('refuse', 'Refusé')], default='en_attente', max_length=20),
        ),
        migrations.AlterField(
            model_name='document',
            name='n_copies',
            field=models.IntegerField(),
        ),
    ]