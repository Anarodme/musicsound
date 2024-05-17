import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PodcastServiceService } from 'src/app/Services/Podcast/podcast-service.service';
import { CategoriesPodcastServiceService } from 'src/app/Services/Categories-Podcast/categories-podcast-service.service';
import { map } from 'rxjs';
import { FavoritesService } from 'src/app/Services/Favorites/favorites.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.component.html',
  styleUrls: ['./podcast.component.css']
})
export class PodcastComponent {
  categoryName: string;
  categoryId: number;
  podcasts: any[];
  podcastId: string;
  coverImage: string = '';
  libraryId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private PodcastServiceService: PodcastServiceService,
    private favoritesService : FavoritesService,
    private userService : UserService,

  ){ }

  ngOnInit() {
    // Fetch the list of podcast by category
    this.route.paramMap.subscribe(params => {
      this.categoryId = +params.get('categoryId');
      this.userService.isAuth().then((data) => {
        if (data.value && data.userAuth) {
          this.userService.getMyLibrary(data.userAuth).subscribe(
            (response) => {
              if (response && response.length > 0) {
                this.libraryId = response[0].id;
              } else {
                console.error('No se encontró ninguna biblioteca para este usuario.');
              }
            },
            (error) => {
              console.error('Error al obtener la biblioteca del usuario:', error);
            }
          );
        } else {
          console.error('Usuario no autenticado.');
        }
  
      });
  
      if (this.categoryId) {
        this.PodcastServiceService
          .getPodcastsByCategory(this.categoryId)
          .subscribe(data => {
            this.podcasts = data;
            console.log("datos extraídos", data);
          });
      }
    });
  }

  toggleFavorite(podcast: any) {
    // Toggle the favorite status of the podcast
    podcast.favorite = !podcast.favorite;

    // If the podcast is marked as favorite, add it to the liked podcasts
    if (podcast.favorite) {
      const podcastId = podcast.id;
      this.favoritesService.addToLikedPodcasts(podcast.id, this.libraryId);
      console.log(podcastId);
    }
  }

  // Method to navigate to the episodes page filtered by a specific podcast
  navigateToEpisodes(podcastId: number) {
    this.router.navigate(['podcast', podcastId, 'episodes']);
  }


}

