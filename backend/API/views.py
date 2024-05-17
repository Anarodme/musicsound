from django.shortcuts import get_object_or_404
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime,timedelta
from django.utils import timezone

from .serializer import UserSerializer,UserEditSerializer,ArtistSerializer,AlbumSerializer,GenreSerializer,SongSerializer,PodcastCategorySerializer,PodcastSerializer,EpisodeSerializer,PlaylistSerializer,LibrarySerializer,FavoriteListSerializer,SuscriptionSerializer,AdsSerializer,PodcastSerializer2
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Artist,Album,Genre,Song,PodcastCategory,Podcast,Episode,Library,PlayList,FavoriteList,Suscription,Ads

from rest_framework.decorators import authentication_classes,permission_classes
from rest_framework.authentication import SessionAuthentication,TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from django.core.mail import send_mail
from django.http import JsonResponse


#Inicio de vistas para el manejo de usuarios

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User,username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({"detail":"Usuario o Contraseña incorrecto"},status=status.HTTP_404_NOT_FOUND)
    
    Token.objects.filter(user=user).delete()
    token,created = Token.objects.get_or_create(user=user)


    serializer =UserSerializer(instance=user)
    return Response({"token":token.key,"user":serializer.data})


@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        
        username = serializer.validated_data['username']
        if User.objects.filter(username=username).exists():
            return Response({"detail": "Nombre de usuario ya en uso."}, status=status.HTTP_409_CONFLICT)
        
        
        email = serializer.validated_data['email']
        if User.objects.filter(email=email).exists():
            return Response({"detail": "Correo electrónico ya en uso.","type":'Email'}, status=status.HTTP_409_CONFLICT)
        

        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        #user_id = user.pk
        user.save()
        token = Token.objects.create(user=user)

         # Crear una librería asociada al usuario
        library_data = {'user': user.id}
        library_serializer = LibrarySerializer(data=library_data)
        if library_serializer.is_valid():
            library_serializer.save()

        # Crear una favorite-list asociada a la libreria del usuario
        favorite_list_data = {'library': library_serializer.instance.id}
        favorite_list_serializer = FavoriteListSerializer(data=favorite_list_data)
        if favorite_list_serializer.is_valid():
            favorite_list_serializer.save()

        # Crear una nueva instancia de suscripción
        subscription_data = {
            "expiration_date":datetime.now(),
            "plan":1,
            "user":user.id,
        }
        subscription = SuscriptionSerializer(data=subscription_data)

        # Guardar la suscripción en la base de datos
        if subscription.is_valid():
            subscription.save()


        return Response({"token":token.key,"user":serializer.data})
    if not serializer.is_valid():
        return Response({"detail": "Nombre de usuario ya en uso.","type":'Username'}, status=status.HTTP_409_CONFLICT)
    return Response(serializer.errors,status=status.HTTP_409_CONFLICT)


@api_view(['GET'])#Verificar la valides del token del usuario
@authentication_classes([SessionAuthentication,TokenAuthentication])
@permission_classes([IsAuthenticated])
def tokenIsValid(request):
    user_id = request.user.id
    username = request.user.username
    email = request.user.email
    message = {'authenticated': True, 'user_id': user_id,'username':username,"email":email}
    return Response(message)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def logout(request):
    if request.method == 'GET':
        try:
            # Delete the user's token to logout
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

#Fin de las vistas para el manejo de usuarios


@api_view(['POST'])
def correo_recuperacion(request):
    email = request.data.get('email')
    try:
        if email:
            user = get_object_or_404(User, email=email)
            Token.objects.filter(user=user).delete()
            token,created = Token.objects.get_or_create(user=user)
            send_mail(
                'Recuperación de contraseña',
                f'Utilice este enlace para restablecer su contraseña: http://localhost:4200/cambiar-contrase%C3%B1a/?token={token}',
                'musicsoundbizcochos@gmail.com',
                [email],
                fail_silently=False,
            )
            return Response({'message': 'Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña.'})
    except:
        return Response({'error':'El email ingresado no se encuentra registrado.'},status=400)
    return Response({'error': 'No se proporcionó una dirección de correo electrónico.'}, status=400)


@api_view(['POST'])
def restablecer_contraseña(request):
    token = request.data.get('token')
    password = request.data.get('password')
    if token and password:
        try:
            user = Token.objects.get(key=token).user
            user.set_password(password)
            user.save()
            Token.objects.filter(user=user).delete()
            return JsonResponse({'message': 'La contraseña se ha restablecido correctamente.'})
        except:
            return JsonResponse({'error': 'El token es inválido o ha caducado.'}, status=400)
    return JsonResponse({'error': 'Se requieren el token y la nueva contraseña.'}, status=400)






#Inicio las vistas con peticion GET para los End-Points


@api_view(['GET']) #Obtener la lista de artistas musicales
def artist_list(request):
    if request.method == 'GET':
        artists = Artist.objects.all()
        serializer = ArtistSerializer(artists, many=True)
        return Response(serializer.data)
    
@api_view(['GET']) #Obtener la lista de albumes para un artista
def album_list(request,artist_id):
    if request.method == 'GET':
        albums = Album.objects.filter(artist=artist_id)
        serializer = AlbumSerializer(albums, many=True)
        return Response(serializer.data)
  
@api_view(['GET']) #Obtener la lista de generos musicales
def genre_list(request):
    if request.method == 'GET':
        genres = Genre.objects.all()
        serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data)
    
    
@api_view(['GET']) #Obtener las canciones de un album
def album_songs(request, album_id):
    if request.method == 'GET':
        try:
            songs = Song.objects.filter(album_id=album_id)
            serializer = SongSerializer(songs, many=True)
            return Response(serializer.data)
        except Song.DoesNotExist:
            return Response({'message': 'No se encontraron canciones para este álbum'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST']) #Obtener las canciones de una playlist/favorite list
def get_songs(request):
    if request.method == 'POST':
        try:
            song_ids = request.data['songs']  # Obtener la lista de IDs
            if not song_ids:
                return Response({'message': 'No se proporcionaron IDs de canciones'}, status=status.HTTP_400_BAD_REQUEST)
            
            songs = Song.objects.filter(id__in=song_ids)  # Filtrar canciones por las IDs proporcionadas
            serializer = SongSerializer(songs, many=True)
            return Response(serializer.data)
        except Song.DoesNotExist:
            return Response({'message': 'No se encontraron las canciones'}, status=status.HTTP_404_NOT_FOUND)
        
@api_view(['POST']) #Obtener los podcast de una favorite list
def get_podcasts(request):
    if request.method == 'POST':
        try:
            pod_ids = request.data['podcasts']  # Obtener la lista de IDs
            if not pod_ids:
                return Response({'message': 'No se proporcionaron IDs de podcasts'}, status=status.HTTP_400_BAD_REQUEST)
            
            podcasts = Podcast.objects.filter(id__in=pod_ids)  # Filtrar podcasts por las IDs proporcionadas
            serializer = PodcastSerializer(podcasts, many=True)
            return Response(serializer.data)
        except Podcast.DoesNotExist:
            return Response({'message': 'No se encontraron los podcasts'}, status=status.HTTP_404_NOT_FOUND)
        

@api_view(['GET']) #Obtener la lista de categorias de podcasts
def podcastCategory_list(request):
    if request.method == 'GET':
        podcastsCaregory = PodcastCategory.objects.all()
        serializer = PodcastCategorySerializer(podcastsCaregory, many=True)
        return Response(serializer.data)
    
@api_view(['GET']) #Obtener la lista de podcasts
def podcast_list(request):
    if request.method == 'GET':
        podcasts = Podcast.objects.all()
        serializer = PodcastSerializer(podcasts, many=True)
        return Response(serializer.data)
    
#Obtener los podcast por categoría
@api_view(['GET'])
def podcastbycategory(request, category_id):
    if request.method == 'GET':
        try:
            # Obtener todos los podcasts que pertenecen a la categoría específica
            podcasts = Podcast.objects.filter(category=category_id)
            serializer = PodcastSerializer(podcasts, many=True)
            return Response(serializer.data)
        except Podcast.DoesNotExist:
            return Response({'message': 'No se encontraron episodios para esta categoría'}, status=status.HTTP_404_NOT_FOUND)
   
    
@api_view(['GET']) #Obtener los podcast de un determinado usuario
def user_podcast(request, user_id):
    if request.method == 'GET':
        try:
            podcast = Podcast.objects.filter(user_id=user_id)
            serializer = PodcastSerializer(podcast, many=True)
            return Response(serializer.data)
        except Podcast.DoesNotExist:
            return Response({'message': 'No se encontraron podcast para este usuario'}, status=status.HTTP_404_NOT_FOUND)
        
@api_view(['GET']) #Obtener la libreria del usuario
def user_library(request, user_id):
    if request.method == 'GET':
        try:
            library = Library.objects.filter(user_id=user_id)
            serializer = LibrarySerializer(library, many=True)
            return Response(serializer.data)
        except Library.DoesNotExist:
            return Response({'message': 'No se encontro libreria para este usuario'}, status=status.HTTP_404_NOT_FOUND)
        
@api_view(['GET']) #Obtener las playlist de la libreria del usuario
def library_playlist(request, library_id):
    if request.method == 'GET':
        try:
            playlists = PlayList.objects.filter(library_id=library_id)
            serializer = PlaylistSerializer(playlists, many=True)
            return Response(serializer.data)
        except PlayList.DoesNotExist:
            return Response({'message': 'No se encontraron playlist para esta libreria'}, status=status.HTTP_404_NOT_FOUND)
        
@api_view(['GET']) #Obtener una playlist por ID
def playlist_detail(request, playlist_id):
    if request.method == 'GET':
        try:
            playlist = PlayList.objects.get(id=playlist_id)
            serializer = PlaylistSerializer(playlist)
            return Response(serializer.data)
        except PlayList.DoesNotExist:
            return Response({'message': 'No se encontró la playlist'}, status=status.HTTP_404_NOT_FOUND)       
        
@api_view(['GET']) #Obtener la FavoriteList de la libreria del usuario
def library_favoriteList(request, library_id):
    if request.method == 'GET':
        try:
            favoriteList = FavoriteList.objects.filter(library_id=library_id)
            serializer = FavoriteListSerializer(favoriteList, many=True)
            return Response(serializer.data)
        except FavoriteList.DoesNotExist:
            return Response({'message': 'No se encontro una Favorite-list para esta libreria'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET']) #Obtener los episodios de un podcast
def podcast_episodes(request, podcast_id):
    if request.method == 'GET':
        try:
            episodes = Episode.objects.filter(podcast_id=podcast_id)
            serializer = EpisodeSerializer(episodes, many=True)
            return Response(serializer.data)
        except Episode.DoesNotExist:
            return Response({'message': 'No se encontraron episodios para este podcast'}, status=status.HTTP_404_NOT_FOUND)
        

@api_view(['GET']) # obtener el estado de la subscripcion
def status_subscription(request, user_id):
    if request.method == 'GET':
        try:
            # Obtener la suscripción del usuario
            subscription = Suscription.objects.get(user_id=user_id)

            current_date = timezone.now()

            if subscription.plan_id == 1:
                return Response({'status': False})

            elif subscription.plan_id == 2:
                if subscription.expiration_date <= current_date:
                    current_date = timezone.localtime(current_date, timezone=subscription.expiration_date.tzinfo)
                    data = {
                            "user":user_id,
                            "plan":1,
                            "expiration_date":current_date
                        }
                    serializer = SuscriptionSerializer(subscription, data=data)
                    if serializer.is_valid():
                        serializer.save()
                    return Response({'status': False})
                else:
                    return Response({'status': True})
        except Suscription.DoesNotExist:
            return Response({'message': 'No se encontro suscripciones para este usuario'}, status=status.HTTP_404_NOT_FOUND)
        

@api_view(['GET']) #Obtener la lista de anuncios
def ads_list(request):
    if request.method == 'GET':
        ads = Ads.objects.all()
        serializer = AdsSerializer(ads, many=True)
        return Response(serializer.data)
    
        




#Inicio las vistas con peticion POST para los End-Points

@api_view(['POST']) # Actualizar datos de usuario
def update_user(request):
    if request.method == 'POST':
        try:
            user = User.objects.get(pk=request.data['id'])
        except User.DoesNotExist:
            return Response({'message': 'No se encontró el usuario'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserEditSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST']) # Crear una playlist
def create_playlist(request):
    if request.method == 'POST':
        serializer = PlaylistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST']) # Actualizar una playlist
def update_playlist(request, playlist_id):
    try:
        playlist = PlayList.objects.get(id=playlist_id)
        playlist.playlistName = request.POST.get('playlistName', playlist.playlistName)
        if 'coverImage' in request.FILES:
            playlist.coverImage = request.FILES['coverImage']
        playlist.save()
        serializer = PlaylistSerializer(playlist)
        return JsonResponse(serializer.data)
    except PlayList.DoesNotExist:
        return JsonResponse({'error': 'Playlist not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@api_view(['DELETE'])  # Eliminar una playlist
def delete_playlist(request, playlist_id):
    try:
        playlist = PlayList.objects.get(pk=playlist_id)
    except PlayList.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        playlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['POST']) # Crear un podcast
def create_podcast(request):
    if request.method == 'POST':
        serializer = PodcastSerializer2(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST']) # Actualizar un podcast
def update_podcast(request):
    if request.method == 'POST':
        try:
            myPodcat = Podcast.objects.get(pk=request.data['podcastId'])
        except Podcast.DoesNotExist:
            return Response({'message': 'No se encontró el podcast'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PodcastSerializer2(myPodcat, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])  # Eliminar un podcast
def delete_podcast(request, podcastID):
    try:
        podcast = Podcast.objects.get(pk=podcastID)
    except Podcast.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        podcast.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



#-------------------Las 2 siguientes vistas aun estan por comprobar y terminar
    
@api_view(['POST']) # Crear un Episodio
def create_episode(request):
    if request.method == 'POST':
        serializer = EpisodeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST']) # Actualizar el episodio
def update_episode(request):
    if request.method == 'POST':
        episode_id = request.data['episode_id'];

        try:
            episode = Episode.objects.get(pk=episode_id)
        except Episode.DoesNotExist:
            return Response({"error": "El episodio con el ID especificado no existe"}, status=status.HTTP_404_NOT_FOUND)

        serializer = EpisodeSerializer(instance=episode, data=request.data['episode'], partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


@api_view(['POST']) # Actualizar la subscripcion
def update_subscription_premium(request):
    
    current_date = datetime.now()

    if request.method == 'POST':
        try:
            subscription = Suscription.objects.get(user_id=request.data['user_id'])
        except Suscription.DoesNotExist:
            return Response({'message': 'No se encontró suscripción para este usuario'}, status=status.HTTP_404_NOT_FOUND)
        data = {
            "user":request.data['user_id'],
            "plan":2,
            "expiration_date":current_date + timedelta(days=30)
        }

        serializer = SuscriptionSerializer(subscription, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def update_subscription_premium(request):
    current_date = datetime.now()
    if request.method == 'POST':
        user_id = request.data.get('user_id')

        print(request.data)

        if user_id:
            try:
                subscription = Suscription.objects.get(user_id=user_id)
            except Suscription.DoesNotExist:
                return Response({'message': 'No se encontró suscripción para este usuario'}, status=status.HTTP_404_NOT_FOUND)

            data = {
                "user": user_id,
                "plan": 2,
                "expiration_date": current_date + timedelta(days=30)
            }
            serializer = SuscriptionSerializer(subscription, data=data)
            if serializer.is_valid():
                serializer.save()
                """purchase_data = get_purchase_data(subscription)
                response = process_purchase(purchase_data)
                if response.status_code == 200:
                    return Response({'message': 'Compra procesada correctamente'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'Error al procesar la compra'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)"""
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'Método no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

def get_purchase_data(subscription):
    purchase_data = {
        "emisor": {
            "nombre": "musicSound",
            "identificacion": "123456789",
            "correo": "info@musicsound.com"
        },
        "receptor": {
            "nombre": subscription.user.nombre,
            "identificacion": subscription.user.identificacion,
            "correo": subscription.user.email
        },
        "detalle": [
            {
                "idArticulo": "PREMIUM",
                "descripcion": "Plan Premium",
                "cantidad": 1,
                "precio": 7.99,
                "IVA": 0.19,
                "total": 9.52
            }
        ],
        "resumen": {
            "moneda": "USD",
            "metodo_pago": "Tarjeta de crédito",
            "total": 7.99,
            "total_IVA": 1.52,
            "total_general": 9.52
        }
    }
    return purchase_data

def process_purchase(purchase_data):
    response = requests.post('http://10.90.74.37/process_data', json=purchase_data)
    return response










    

@api_view(['POST']) # Agregar una determinada cancion a una determinada playlist
def add_song_to_playlist(request):
    try:
        playlist = PlayList.objects.get(pk=request.data['playlist_id']) # Obtenemos la playlist a la cual vamos a agregar la musica
        song = Song.objects.get(pk=request.data['song_id']) # Obtenemos la cancion que deseamos agregar a nuestra playlist
    except (PlayList.DoesNotExist, Song.DoesNotExist):
        return Response({"message": "No se encontró la playlist o la canción"}, status=status.HTTP_404_NOT_FOUND)

    # Agregar la canción a la playlist
    playlist.songs.add(song)

    # Se guardan los cambios para actualizar la playlist
    playlist.save()

    # Serializar la playlist actualizada y la almacenamos
    serializer = PlaylistSerializer(playlist)
    return Response(serializer.data)

@api_view(['DELETE']) # Quitar una determinada cancion de una determinada playlist
def remove_song_to_playlist(request,playlistId,songId):
    try:
        playlist = PlayList.objects.get(pk=playlistId) # Obtenemos la playlist a la cual vamos a agregar la musica
        song = Song.objects.get(pk=songId) # Obtenemos la cancion que deseamos agregar a nuestra playlist
    except (PlayList.DoesNotExist, Song.DoesNotExist):
        return Response({"message": "No se encontró la playlist o la canción"}, status=status.HTTP_404_NOT_FOUND)

    # Quitar la canción de la playlist
    playlist.songs.remove(song)

    # Se guardan los cambios 
    playlist.save()

    # Serializar la playlist actualizada y la almacenamos
    serializer = PlaylistSerializer(playlist)
    return Response(serializer.data)


@api_view(['POST']) # Agregar una determinada cancion a favoritos
def add_song_to_favoritelist(request):
    try:
        favoritelist = FavoriteList.objects.get(pk=request.data['favoritelist_id']) # Obtenemos la favorite-list a la cual vamos a agregar la musica
        song = Song.objects.get(pk=request.data['song_id']) # Obtenemos la cancion que deseamos agregar a nuestra favorite-list
    except (FavoriteList.DoesNotExist, Song.DoesNotExist):
        return Response({"message": "No se encontró la favorite-list o la canción"}, status=status.HTTP_404_NOT_FOUND)

    # Agregar la canción a la favorite-list
    favoritelist.songs.add(song)

    # Se guardan los cambios para actualizar la favorite-list
    favoritelist.save()

    # Serializar la favorite-list actualizada y la almacenamos
    serializer = FavoriteListSerializer(favoritelist)
    return Response(serializer.data)

@api_view(['DELETE']) # Quitar una determinada cancion de favoritos
def remove_song_to_favoritelist(request,favoritelist_id,song_id):
    try:
        favoritelist = FavoriteList.objects.get(pk=favoritelist_id) # Obtenemos la favorite-list a la cual vamos a agregar la musica
        song = Song.objects.get(pk=song_id) # Obtenemos la cancion que deseamos agregar a nuestra favorite-list
    except (FavoriteList.DoesNotExist, Song.DoesNotExist):
        return Response({"message": "No se encontró la favorite-list o la canción"}, status=status.HTTP_404_NOT_FOUND)

    # Quitar la canción de la favorite-list
    favoritelist.songs.remove(song)

    # Se guardan los cambios 
    favoritelist.save()

    # Serializar la favorite-list actualizada y la almacenamos
    serializer = FavoriteListSerializer(favoritelist)
    return Response(serializer.data)



@api_view(['POST']) # Agregar un determinado podcast a favoritos
def add_podcast_to_favoritelist(request):
    try:
        favoritelist = FavoriteList.objects.get(pk=request.data['favoritelist_id']) # Obtenemos la favorite-list a la cual vamos a agregar el podcast
        podcast = Podcast.objects.get(pk=request.data['podcast_id']) # Obtenemos el podcast que deseamos agregar a nuestra favorite-list
    except (FavoriteList.DoesNotExist, Podcast.DoesNotExist):
        return Response({"message": "No se encontró la favorite-list o el podcast"}, status=status.HTTP_404_NOT_FOUND)

    # Agregar el podcast a la favorite-list
    favoritelist.podcasts.add(podcast)

    # Se guardan los cambios para actualizar la favorite-list
    favoritelist.save()

    # Serializar la favorite-list actualizada y la almacenamos
    serializer = FavoriteListSerializer(favoritelist)
    return Response(serializer.data)


@api_view(['DELETE']) # Quitar un determinado podcast de favoritos
def remove_podcast_to_favoritelist(request,favoritelist_id,podcast_id):
    try:
        favoritelist = FavoriteList.objects.get(pk=favoritelist_id) # Obtenemos la favorite-list a la cual vamos a agregar el podcast
        podcast = Podcast.objects.get(pk=podcast_id) # Obtenemos el podcast que deseamos agregar a nuestra favorite-list
    except (FavoriteList.DoesNotExist, Podcast.DoesNotExist):
        return Response({"message": "No se encontró la favorite-list o el podcast"}, status=status.HTTP_404_NOT_FOUND)

    # Quitar el podcast de la favorite-list
    favoritelist.podcasts.remove(podcast)

    # Se guardan los cambios 
    favoritelist.save()

    # Serializar la favorite-list actualizada y la almacenamos
    serializer = FavoriteListSerializer(favoritelist)
    return Response(serializer.data)