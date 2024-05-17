from datetime import datetime,timedelta
import os
from django.db import models
from django.contrib.auth.models import User

from mutagen.mp3 import MP3
from django.core.exceptions import ValidationError
from django.dispatch import receiver
from django.db.models.signals import post_save,post_delete,m2m_changed


#Inicio de funciones para la creacion de directorios necesarios

def artist_directory_path(instance, filename):
    # Obtenemos el nombre del artista
    artist = instance.artistName
    # Creamos las rutas
    storage_path = os.path.join('artist',artist)
    full_path = os.path.join('media_root', storage_path)
    # Creamos la ruta si esta no existe
    os.makedirs(full_path, exist_ok=True)

    return os.path.join(storage_path, filename)


def album_directory_path(instance, filename):
    # Obtenemos el nombre del artista y el nombre del album
    artist = instance.artist.artistName
    album = instance.albumTitle
    # Creamos las rutas
    storage_path = os.path.join('artist',artist,album)
    full_path = os.path.join('media_root', storage_path)
    # Creamos la ruta si esta no existe
    os.makedirs(full_path, exist_ok=True)

    return os.path.join(storage_path, filename)

def playlist_directory_path(instance, filename):
    # Obtenemos el nombre de usuario asociado a la playlist
    username = instance.library.user.username
    # Creamos la ruta de almacenamiento con el nombre de usuario y el nombre del archivo
    storage_path = os.path.join('users',username)
    full_path = os.path.join('media_root', storage_path)
    # Creamos la ruta si no existe
    os.makedirs(full_path, exist_ok=True)
    
    
    return os.path.join(storage_path, filename)

def songs_directory_path(instance, filename):
    # Obtenemos el nombre del artista y el nombre del album
    artist = instance.album.artist.artistName
    album = instance.album.albumTitle
    # Creamos la ruta de almacenamiento
    storage_path = os.path.join('artist',artist,album,'songs')
    full_path = os.path.join('media_root', storage_path)
    # Creamos la ruta si no existe
    os.makedirs(full_path, exist_ok=True)
    
    return os.path.join(storage_path, filename)

def podcast_directory_path(instance, filename):
    # Obtenemos el nombre del artista 
    user = instance.user.username
    # Creamos la ruta de almacenamiento
    storage_path = os.path.join('users',user,'podcast')
    full_path = os.path.join('media_root', storage_path)
    # Creamos la ruta si no existe
    os.makedirs(full_path, exist_ok=True)
    
    return os.path.join(storage_path, filename)

def episodes_directory_path(instance, filename):
    # Obtenemos el nombre del artista 
    user = instance.podcast.user.username
    # Creamos la ruta de almacenamiento
    storage_path = os.path.join('users',user,'podcast/episodes')
    full_path = os.path.join('media_root', storage_path)
    # Creamos la ruta si no existe
    os.makedirs(full_path, exist_ok=True)
    
    return os.path.join(storage_path, filename)


def adsIMG_directory_path(instance, filename):
    # Creamos las rutas
    storage_path = os.path.join('advert/img')
    full_path = os.path.join('media_root', storage_path)
    # Creamos la ruta si esta no existe
    os.makedirs(full_path, exist_ok=True)

    return os.path.join(storage_path, filename)

def adsAudio_directory_path(instance, filename):
    # Creamos las rutas
    storage_path = os.path.join('advert/audio')
    full_path = os.path.join('media_root', storage_path)
    # Creamos la ruta si esta no existe
    os.makedirs(full_path, exist_ok=True)

    return os.path.join(storage_path, filename)

def podCategories_directory_path(instance,filename):
    # Creamos las rutas
    storage_path = os.path.join('podCat')
    full_path = os.path.join('media_root', storage_path)
    # Creamos la ruta si esta no existe
    os.makedirs(full_path, exist_ok=True)

    return os.path.join(storage_path, filename)


def defaultData_directory_path(instance,filename):
    # Creamos las rutas
    storage_path = os.path.join('defDat')
    full_path = os.path.join('media_root', storage_path)
    # Creamos la ruta si esta no existe
    os.makedirs(full_path, exist_ok=True)

    return os.path.join(storage_path, filename)





#Inicio de los modelos necesarios


class Artist(models.Model):
    artistName = models.CharField(max_length=100)
    description = models.CharField(max_length=400)
    coverImage = models.ImageField(upload_to=artist_directory_path)


class Album(models.Model):
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    albumTitle = models.CharField(max_length=100)
    releaseDate = models.DateTimeField()
    totalDuration = models.DurationField(blank=True,null=True)
    numberOfSongs = models.PositiveIntegerField(blank=True,null=True)
    coverImage = models.ImageField(upload_to=album_directory_path)
    backGroundImage = models.ImageField(upload_to=album_directory_path)


class Library(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)


class Genre(models.Model):
    name = models.CharField(max_length=60)



class Song(models.Model):

    def validate_mp3(value):
        if not value.name.endswith('.mp3'):
            raise ValidationError('El archivo debe tener extensión .mp3')

    songTitle = models.CharField(max_length=100)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    duration = models.DurationField(blank=True,null=True)
    #numberOfReproductions = models.PositiveBigIntegerField()
    #likes = models.PositiveBigIntegerField()
    audio = models.FileField(upload_to=songs_directory_path,blank=False,validators=[validate_mp3])
    genre = models.ForeignKey(Genre,on_delete=models.PROTECT)

class PlayList(models.Model):
    library = models.ForeignKey(Library,on_delete=models.CASCADE)
    playlistName = models.CharField(max_length=100)
    songs = models.ManyToManyField(Song,blank=True)
    numberOfSongs = models.PositiveIntegerField(blank=True,null=True)
    totalDuration = models.DurationField(blank=True,null=True)
    coverImage = models.ImageField(upload_to=playlist_directory_path,blank=True,null=True)

class PodcastCategory(models.Model):
    name = models.CharField(max_length=60)
    coverImage = models.ImageField(upload_to=podCategories_directory_path)

class Podcast(models.Model):
    podcastTitle = models.CharField(max_length=100)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    category = models.ForeignKey(PodcastCategory,on_delete=models.PROTECT)
    description = models.CharField(max_length=400)
    coverImage = models.ImageField(upload_to=podcast_directory_path,blank=True,null=True)


class Episode(models.Model):
    episodeTitle = models.CharField(max_length=100)
    podcast = models.ForeignKey(Podcast,on_delete=models.CASCADE)
    description = models.CharField(max_length=400)
    duration = models.DurationField(blank=True,null=True)
    episode = models.FileField(upload_to=episodes_directory_path,blank=True,null=True)
    releaseDate = models.DateTimeField(auto_now_add=True)
    live = models.BooleanField()


class FavoriteList(models.Model):
    library = models.ForeignKey(Library,on_delete=models.CASCADE)
    songs = models.ManyToManyField(Song,blank=True)
    podcasts = models.ManyToManyField(Podcast,blank=True)
    numberOfPodcast = models.PositiveIntegerField(blank=True,null=True)
    numberOfSongs = models.PositiveIntegerField(blank=True,null=True)
    totalDuration = models.DurationField(blank=True,null=True)



class Plan(models.Model):

    PLAN_CHOICES = [
        ('F', 'Free'),
        ('P', 'Premium')
    ]

    type = models.CharField(max_length=1,choices=PLAN_CHOICES)
    description = models.CharField(max_length=400)
    price = models.DecimalField(max_digits=10, decimal_places=2)

class Suscription(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan,on_delete=models.CASCADE)
    expiration_date = models.DateTimeField(blank=True,null=True)

    def __str__(self):
        return f"Suscription of {self.user.username}"

class Ads(models.Model):
    ad_image = models.ImageField(upload_to=adsIMG_directory_path)
    ad_audio = models.FileField(upload_to=adsAudio_directory_path)


class defaultData(models.Model):
    name = models.CharField(max_length=30) 
    image = models.ImageField(upload_to=defaultData_directory_path,blank=True,null=True)
    file = models.FileField(upload_to=defaultData_directory_path,blank=True,null=True)






#Inicio de los signals



@receiver(post_save, sender=Song)#Para songs
def set_song_duration(sender, instance, **kwargs):
    if instance.audio and not kwargs.get('raw', False):
        audio_path = instance.audio.path
        try:
            # Desactiva las señales temporariamente
            post_save.disconnect(set_song_duration, sender=Song)
            audio_info = MP3(audio_path)
            
            instance.duration = timedelta(seconds=audio_info.info.length)
            instance.save()
        except Exception as e:
            print(f"No se pudo obtener la duración del archivo: {e}")
        finally:
            # Vuelve a conectar las señales
            post_save.connect(set_song_duration, sender=Song)


@receiver(post_save, sender=Episode)#Para Episodios
def set_episode_duration(sender, instance, **kwargs):
    if instance.episode and not kwargs.get('raw', False):
        episode_path = instance.episode.path
        try:
            # Desactiva las señales temporariamente
            post_save.disconnect(set_episode_duration, sender=Episode)
            episode_info = MP3(episode_path)
            
            instance.duration = timedelta(seconds=episode_info.info.length)
            instance.save()
        except Exception as e:
            print(f"No se pudo obtener la duración del archivo: {e}")
        finally:
            # Vuelve a conectar las señales
            post_save.connect(set_episode_duration, sender=Episode)




# Función para calcular la duración total de las canciones/episodios
def calculate_total_duration(songs):
    total_duration = timedelta(seconds=0)
    for song in songs:
        if song.duration:
            total_duration += song.duration
    return total_duration


def update_album_info(album):
    # Obtener todas las canciones asociadas al álbum
    songs_in_album = Song.objects.filter(album=album)
    # Calcular la duración total de todas las canciones
    total_duration = calculate_total_duration(songs_in_album)
    # Actualizar los campos del álbum
    album.totalDuration = total_duration
    album.numberOfSongs = songs_in_album.count()
    album.save()

# Receptor para la señal post_save, que se activa después de que se guarde una instancia de Song
@receiver(post_save, sender=Song)
def update_album_on_song_save(sender, instance, **kwargs):
    # Llama a la función de actualización del álbum
    update_album_info(instance.album)

# Receptor para la señal post_delete, que se activa después de que se elimine una instancia de Song
@receiver(post_delete, sender=Song)
def update_album_on_song_delete(sender, instance, **kwargs):
    # Llamae a la función de actualización del álbum
    update_album_info(instance.album)



@receiver(m2m_changed, sender=PlayList.songs.through)#Para playlist
def update_playlist_info(sender, instance, action, **kwargs):
    if action == 'post_add' or action == 'post_remove':
        playlist = instance
        # Obtener todas las canciones en la lista de reproducción
        songs_in_playlist = playlist.songs.all()
        # Calcular la duración total y el número de canciones
        total_duration = calculate_total_duration(songs_in_playlist)
        number_of_songs = songs_in_playlist.count()
        # Actualizar los campos de la lista de reproducción
        playlist.totalDuration = total_duration
        playlist.numberOfSongs = number_of_songs
        playlist.save()

@receiver(m2m_changed, sender=FavoriteList.songs.through)#Para favorite list
def update_favoritelist_info(sender, instance, action, **kwargs):
    if action == 'post_add' or action == 'post_remove':
        favorite_list = instance
        # Obtener todas las canciones en la lista de reproducción
        songs_in_favorite_list = favorite_list.songs.all()
        # Calcular la duración total y el número de canciones
        total_duration = calculate_total_duration(songs_in_favorite_list)
        number_of_songs = songs_in_favorite_list.count()
        # Actualizar los campos de la lista de reproducción
        favorite_list.totalDuration = total_duration
        favorite_list.numberOfSongs = number_of_songs
        favorite_list.save()

@receiver(m2m_changed, sender=FavoriteList.podcasts.through)#Para favorite list
def update_favoritelist_info(sender, instance, action, **kwargs):
    if action == 'post_add' or action == 'post_remove':
        favorite_list = instance
        # Obtener todos los podcast
        podcast_in_favorite_list = favorite_list.podcasts.all()
        number_of_podcast = podcast_in_favorite_list.count()
        # Actualizar los campos de la lista de reproducción
        favorite_list.numberOfPodcast = number_of_podcast
        favorite_list.save()