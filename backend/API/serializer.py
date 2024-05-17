from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Artist,Album,Library,Genre,Song,PlayList,PodcastCategory,Podcast,Episode,FavoriteList,Plan,Suscription,Ads

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['id','username','password','email']

class UserEditSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['id','username','email']


class ArtistSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Artist
        fields = ['id','artistName','description','coverImage']

class AlbumSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer() # Anidamos el serializador de artista
    
    class Meta(object):
        model = Album
        fields = ['id','artist','albumTitle','releaseDate','totalDuration','numberOfSongs','coverImage','backGroundImage']

class LibrarySerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Library
        fields = ['id','user']
        
class GenreSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Genre
        fields = ['id','name']

class SongSerializer(serializers.ModelSerializer):
    album = AlbumSerializer()  # Anidamos el serializador de Album

    class Meta(object):
        model = Song
        fields = ['id','songTitle','album','duration','audio','genre']

class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)

    class Meta:
        model = PlayList
        fields = ['id', 'library', 'playlistName', 'songs', 'numberOfSongs', 'totalDuration', 'coverImage']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation

class PodcastCategorySerializer(serializers.ModelSerializer):
    class Meta(object):
        model = PodcastCategory
        fields = ['id','name', 'coverImage']

class PodcastSerializer(serializers.ModelSerializer):
    category = PodcastCategorySerializer()  # Anidamos el serializador de category
    user = UserSerializer()

    class Meta(object):
        model = Podcast
        fields = ['id','podcastTitle','user','category','description','coverImage']

class PodcastSerializer2(serializers.ModelSerializer):
    class Meta(object):
        model = Podcast
        fields = ['id','podcastTitle','user','category','description','coverImage']

class EpisodeSerializer(serializers.ModelSerializer):
    podcast = PodcastSerializer()  # Anidamos el serializador de podcast

    class Meta(object):
        model = Episode
        fields = ['id','episodeTitle','podcast','description','duration','episode','releaseDate','live']

class EpisodeSongSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Episode
        fields = ['id','episode']

class FavoriteListSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = FavoriteList
        fields = ['id','library','songs','podcasts','numberOfPodcast','numberOfSongs','totalDuration']

class PlanSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Plan
        fields = ['id','type','description','price']

class SuscriptionSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Suscription
        fields = ['id','user','plan','expiration_date']

class AdsSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Ads
        fields = ['id','ad_image','ad_audio']