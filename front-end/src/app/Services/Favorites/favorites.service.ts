import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }


  // Method to add songs to favorites
  addToLikedSongs(songId: number, libraryId: number) {
    const url = `${this.apiUrl}/api/favorite-list/add-song/`;
    const payload = { favoritelist_id: libraryId, song_id: songId };

    this.http.post(url, payload).subscribe(
      response => {
        console.log('Canción añadida a favoritos:', response);
      },
      error => {
        console.error('Error al añadir canción a favoritos:', error);
      }
    );
  }
  // Method to add podcasts to favorites
  addToLikedPodcasts(podcastId: number, libraryId: number) {
    const url = `${this.apiUrl}/api/favorite-list/add-podcast/`;
    const payload = { favoritelist_id: libraryId, podcast_id: podcastId };

    this.http.post(url, payload).subscribe(
      response => {
        console.log('Podcast añadido a favoritos:', response);
      },
      error => {
        console.error('Error al añadir podcast a favoritos:', error);
      }
    );
  }


  // Method to get the favorites by libraryId
  getFavorites(libraryid: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/library/${libraryid}/favorite-list/`);
  }

}
