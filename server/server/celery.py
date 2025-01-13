import os
from django.conf import settings
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

app = Celery('server')
app.config_from_object(f'django.conf:{settings.__name__}', namespace='CELERY')
app.autodiscover_tasks()