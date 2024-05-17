# Generated by Django 5.0.1 on 2024-04-02 01:41

import API.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0003_episode_live_alter_episode_episode'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ads',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ad_image', models.ImageField(upload_to=API.models.adsIMG_directory_path)),
                ('ad_audio', models.FileField(upload_to=API.models.adsAudio_directory_path)),
            ],
        ),
    ]