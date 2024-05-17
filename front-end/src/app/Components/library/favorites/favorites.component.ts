import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, map, throwError, forkJoin, Subscription } from 'rxjs';
import { FavoritesService } from 'src/app/Services/Favorites/favorites.service';
import { SongsService } from 'src/app/Services/Songs/songs.service';
import { ActivatedRoute, Router  } from '@angular/router';
import { PodcastServiceService } from 'src/app/Services/Podcast/podcast-service.service';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit,OnDestroy {

  listOfIdSongs:number[] = [];
  songsData = [];

  listOfIdPodcast:number[] = [];
  podcastsData = [];

  suscription:Subscription;

  contentType = 'liked-songs'; // Valor inicial

  contentTypes = {
    'liked-songs': {
      title: 'LIKED SONGS',
      headers: ['#', 'Title', 'Favorito', 'Duración']
    },
    'liked-podcasts': {
      title: 'LIKED PODCASTS',
      headers: ['#', 'Title', 'Favorito', 'Duración']
    }
  };

  contentTypeKeys: string[]; // Variable para almacenar las claves del objeto contentTypes
  favorites: any[] = []; // Variable para almacenar la lista de favoritos
  libraryId: number;

  constructor(
    private favoritesService: FavoritesService, 
    private songservice: SongsService,
    private podcastService:PodcastServiceService,
    private router: Router,
    private route: ActivatedRoute,) {
    this.contentTypeKeys = Object.keys(this.contentTypes); // Inicializa la variable contentTypeKeys
    
  }

  ngOnInit(): void {
     // Suscribe a los cambios en los parámetros de la ruta
     this.route.paramMap.subscribe(params => {
      // Obtener el ID de la biblioteca de los parámetros de la ruta
      this.libraryId = +params.get('libraryId');
      console.log('ID de la biblioteca:', this.libraryId);
      // Obtener y mostrar las listas de reproducción por el ID de la biblioteca
      this.loadFavorites().then((successfully)=>{
        if (successfully) {
          //Obtener las canciones 
          this.songservice.getSongsByList({'songs':this.listOfIdSongs}).subscribe((response)=>{
            response.forEach(songObject => {
              this.songsData.push(songObject);
            });
          },(error)=>{
            console.log(error.error);
          })


          this.podcastService.getPodcastsByList({'podcasts':this.listOfIdPodcast}).subscribe((response)=>{
            response.forEach(podcastObject => {
              this.podcastsData.push(podcastObject);
            });
          },(error)=>{
            console.log(error.error);
          })

        }
      });
     })
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  loadFavorites():Promise<any>{
    return new Promise<any>((resolve) => {

    this.suscription = this.favoritesService.getFavorites(this.libraryId).subscribe((response)=>{
      this.listOfIdSongs.push(...response[0].songs);
      this.listOfIdPodcast.push(...response[0].podcasts);
      resolve(true)
    },(error)=>{
      console.log(error.error);
      resolve(false)
    })

    })
  }

  navigateToEpisodes(id:number){
    this.router.navigate(['/']);
  }

  onContentTypeChange(): void {
    console.log('ContentType changed:', this.contentType);
  }

  toggleFavorite(content: any): void {
    console.log('Toggle favorite:', content);
  }

}
