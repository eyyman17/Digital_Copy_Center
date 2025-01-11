"""
WSGI config for digital_copy_center project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digital_copy_center.settings')

application = get_wsgi_application()




from django.apps import apps
CustomUser = apps.get_model('accounts', 'CustomUser')

if not CustomUser.objects.filter(username='admin').exists():
    CustomUser.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='securepassword'
    )
    print("Superuser 'admin' created successfully.")