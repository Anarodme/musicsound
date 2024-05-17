import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  private apiUrl = 'http://127.0.0.1:8000';

  private selectedAlbumSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public selectedAlbum$: Observable<any> = this.selectedAlbumSubject.asObservable();
  private selectedArtistIdSource = new BehaviorSubject<number | null>(null);
  selectedArtistId$ = this.selectedArtistIdSource.asObservable();

  constructor(private http: HttpClient) { }

  // Method to get the artists
  getArtists(): Observable<any[]> {
    const url = `${this.apiUrl}/artists/`;
    return this.http.get<any[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching artists:', error);
        return throwError(error);
      }),
      map(artists =>{
          return artists.map(artists => ({
            id: artists.id,
            artistName: artists.artistName,
            description: artists.description,
            coverImage: `${this.apiUrl}${artists.coverImage}`,

          }));
        })
      );
    }

    setSelectedArtistId(artistId: number | null) {
      this.selectedArtistIdSource.next(artistId);
    }

}
