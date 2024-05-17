# Generated by Django 5.0.1 on 2024-04-14 20:38

import API.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0009_alter_podcast_coverimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='defaultData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('image', models.ImageField(blank=True, null=True, upload_to=API.models.defaultData_directory_path)),
                ('file', models.FileField(blank=True, null=True, upload_to=API.models.defaultData_directory_path)),
            ],
        ),
        migrations.AddField(
            model_name='podcastcategory',
            name='coverImage',
            field=models.ImageField(default='', upload_to=API.models.podCategories_directory_path),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='album',
            name='releaseDate',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='coverImage',
            field=models.ImageField(blank=True, null=True, upload_to=API.models.playlist_directory_path),
        ),
    ]
