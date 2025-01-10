# Generated by Django 4.2.16 on 2024-12-31 10:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=150, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserHandler',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('handlername', models.CharField(max_length=100)),
                ('handlerid', models.CharField(max_length=100)),
                ('platform', models.CharField(choices=[('LC', 'Leetcode'), ('GH', 'Github')], max_length=2)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.userprofile')),
            ],
        ),
        migrations.CreateModel(
            name='IndividualStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contributions', models.IntegerField(default=0)),
                ('submissions', models.IntegerField(default=0)),
                ('recorded_at', models.DateTimeField(auto_now_add=True)),
                ('handlerid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.userhandler')),
            ],
        ),
    ]
