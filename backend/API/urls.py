from django.urls import re_path
from . import views
from . import podcast

urlpatterns = [
    re_path('login',views.login),
    re_path('signup',views.signup),
    re_path('registered-User',views.tokenIsValid),
    re_path('logout',views.logout),
    re_path('email',views.correo_recuperacion),
    re_path('rest-pass',views.restablecer_contraseña),
    re_path('update/user',views.update_user),

    re_path('devices',podcast.check_audio_devices),
    re_path('check-broadcast',podcast.checkbroadcast),
    re_path('start-broadcast',podcast.startbroadcast),
    re_path('get-podcasts',podcast.listeners),
    re_path('microphone-control',podcast.microphone_control),
    re_path('music-control',podcast.music_control),
    re_path('upload-file',podcast.uploadMusic),
    re_path('stop-broadcast',podcast.stopbroadcast),

    
    re_path('ads/', views.ads_list, name='ads-list'),# Obtener la lista de anuncios
    re_path('artists/', views.artist_list, name='artist-list'),# Obtener la lista de artistas
    #re_path('albumes/', views.album_list, name='album-list'),# Obtener la lista de albumes
    re_path(r'^api/albumes/(?P<artist_id>\d+)/$', views.album_list, name='album-list'),# Obtener la lista de albumes de un artista
    re_path(r'^api/album/(?P<album_id>\d+)/songs/$', views.album_songs, name='album-songs'),# Obtener las canciones de un determinado album
    re_path('genres/', views.genre_list, name='genres-list'),# Obtener la lista de generos musicales


    re_path(r'^api/user/(?P<user_id>\d+)/library/$', views.user_library, name='user-library'),# Obtener la libreria de un determinado usuario
    re_path(r'^api/library/(?P<library_id>\d+)/playlists/$', views.library_playlist, name='library-playlist'),# Obtener las playlist de la libreria del usuario
    re_path(r'^api/playlist/(?P<playlist_id>\d+)/songs/$',  views.playlist_detail, name='playlist-detail'), #Obtener una playlist por ID
    re_path(r'^api/library/(?P<library_id>\d+)/favorite-list/$', views.library_favoriteList, name='library-favorite-list'),# Obtener la FavoriteList de la libreria del usuario
    re_path(r'^api/status-subscription/(?P<user_id>\d+)/$', views.status_subscription, name='status_subscription'),# Obtener el estado de la subscripcion

    re_path('PodcastCategories/', views.podcastCategory_list, name='PodcastCategory-list'),# Obtener la lista de categorias para podcast
    re_path('Podcasts/', views.podcast_list, name='Podcast-list'),# Obtener la lista de podcasts
    re_path(r'^api/user/(?P<user_id>\d+)/podcasts/$', views.user_podcast, name='user-podcasts'),# Obtener los podcats de un determinado usuario
    re_path(r'^api/podcast/(?P<podcast_id>\d+)/episodes/$', views.podcast_episodes, name='podcast-episodes'),# Obtener los episodios de un determinado podcast
    re_path(r'^api/podcast/(?P<category_id>\d+)/$', views.podcastbycategory, name='podcast-podcastsbycategory'),# Obtener la lista de podcasts por categoría

    re_path('api/get/songs/', views.get_songs, name='get-songs'),# Obtener canciones
    re_path('api/get/podcasts/', views.get_podcasts, name='get-podcasts'),# Obtener podcasts

    re_path('api/playlist/add-song/', views.add_song_to_playlist, name='add_song_to_playlist'),# Agregar una determinada cancion a una determinada playlist
    re_path(r'^api/remove-song/(?P<songId>\d+)/playlist/(?P<playlistId>\d+)/$', views.remove_song_to_playlist, name='remove_song_to_playlist'),# Quitar una determinada cancion de una determinada playlist
    re_path('api/favorite-list/add-song/', views.add_song_to_favoritelist, name='add_song_to_favoritelist'),# Agregar una determinada cancion a favoritos
    re_path(r'^api/remove-song/(?P<song_id>\d+)/favorite-list/(?P<favoritelist_id>\d+)/$', views.remove_song_to_favoritelist, name='remove_song_to_favoritelist'),# Quitar una determinada cancion de una determinada favorite list
    re_path('api/favorite-list/add-podcast/', views.add_podcast_to_favoritelist, name='add_podcast_to_favoritelist'),# Agregar un determinado podcast a favoritos
    re_path(r'^api/remove-podcast/(?P<song_id>\d+)/favorite-list/(?P<favoritelist_id>\d+)/$', views.remove_podcast_to_favoritelist, name='remove_podcast_to_favoritelist'),# Quitar un determinado podcast de una determinada favorite list

    re_path('api/get-premium-plan/', views.update_subscription_premium, name='update_subscription_premium'),# Actualizar plan a premium
    
    re_path(r'^api/update_subscription_premium/$', views.update_subscription_premium, name='update_subscription_premium'),
    
    re_path('api/playlist/create/', views.create_playlist, name='create_playlist'),# Crear una playlist
    re_path(r'^api/playlist/(?P<playlist_id>\d+)/update/$', views.update_playlist, name='update_playlist'),# Actualizar datos de una playlist
    re_path(r'^api/playlist/(?P<playlist_id>\d+)/delete/$', views.delete_playlist, name='delete_playlist'),# Eliminar una playlist

    re_path('api/podcasts/create/', views.create_podcast, name='create_podcast'),# Crear un podcast
    re_path('api/podcasts/update/', views.update_podcast, name='update_podcast'),# Actualizar datos de un podcast
    re_path(r'^api/podcast/(?P<podcastID>\d+)/delete/$', views.delete_podcast, name='delete_podcast'),# Eliminar un podcast
    
    # De aqui para abajo aun no estan terminados
    re_path(r'^api/podcasts/(?P<podcast_id>\d+)/episodes/create/$', views.create_episode, name='create_episode'),# Crear un episodio de podcast



]