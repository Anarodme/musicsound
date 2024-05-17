import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private apiUrl = 'http://127.0.0.1:8000';

  private selectedAlbumSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public selectedAlbum$: Observable<any> = this.selectedAlbumSubject.asObservable();
  songs: any;

  constructor(private http: HttpClient) { }


  // Method to get albums by artistId
  getAlbumByartist(artistsId: number): Observable<any[]> {
    const url = `${this.apiUrl}/api/albumes/${artistsId}/`;
    return this.http.get<any[]>(url).pipe(
      map(albumes => {
        return albumes.map(albumes => ({
          id: albumes.id,
          albumTitle: albumes.albumTitle,
          releaseDate: albumes.releaseDate,
          totalDuration: albumes.totalDuration,
          numberOfSongs: albumes.numberOfSongs,
          coverImage: `${this.apiUrl}${albumes.coverImage}`,
          backgroundImage: `${this.apiUrl}${albumes.backgroundImage}`,
          artist_id: albumes.artist_id,
        }));
      }),
      catchError(error => {
        console.error('Error fetching album songs:', error);
        return throwError(error);
      })
    );
  }


  // Method to get songs by albumId
  getSongOfAlbum(albumId: number): Observable<any[]> {
    const url = `${this.apiUrl}/api/album/${albumId}/songs/`;
    return this.http.get<any[]>(url).pipe(
      map(songs => {
        return songs.map(song => ({
          id: song.id,
          songTitle: song.songTitle,
          audio: `${this.apiUrl}${song.audio}`,
          duration: song.duration,
          album: {
            id: song.album.id,
            albumTitle: song.album.albumTitle,
            releaseDate: song.album.releaseDate,
            coverImage: `${this.apiUrl}${song.album.coverImage}`,
            artist: {
              id: song.album.artist.id,
              artistName: song.album.artist.artistName,
              description: song.album.artist.description,
            }
          }
        }));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching album details and songs:', error);
        return throwError(error);
      })
    );
  }


  setSelectedAlbum(album: any): void {
    this.selectedAlbum$ = album;
  }


  getSelectedAlbum(): any {
    return this.selectedAlbum$;
  }
}
