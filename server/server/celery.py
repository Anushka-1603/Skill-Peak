import os
from django.conf import settings
from celery import Celery
from datetime import datetime
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

app = Celery('server')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Schedule the update_stats task to run every Saturday at midnight
app.conf.beat_schedule = {
    'update-stats-weekly': {
        'task': 'api.tasks.update_stats',
        'schedule': crontab(hour=0, minute=0, day_of_week=6),
    },
}  