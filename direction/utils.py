"""from django.db.models import Count
from django.db.models.functions import TruncMonth
from .models import Command

def get_trend_data():
    trend_data = (
        Command.objects
        .annotate(month=TruncMonth('created_at'))  # Grouper par mois
        .values('month')  # Garder uniquement les mois
        .annotate(total=Count('id'))  # Compter les commandes
        .order_by('month')  # Trier par mois
    )
    return trend_data"""
