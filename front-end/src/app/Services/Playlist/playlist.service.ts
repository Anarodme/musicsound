import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private baseUrl = 'http://127.0.0.1:8000';
  private playlistsUpdated$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  // Método para obtener todas las playlists de una biblioteca
  getPlaylistsByLibraryId(libraryId: number): Observable<any[]> {
    const url = `${this.baseUrl}/api/library/${libraryId}/playlists/`;
    return this.http.get<any[]>(url).pipe(
      map((playlists) => {
        return playlists.map((playlist) => ({
          id: playlist.id,
          playlistName: playlist.playlistName,
          coverImage: `${this.baseUrl}${playlist.coverImage}`,
          totalDuration: playlist.totalDuration,
        }));
      }),
      catchError(this.handleError)
    );
  }

  //Método para obtener una playlist por su ID
  getPlaylist(playlistId: number): Observable<any> {
    const url = `${this.baseUrl}/api/playlist/${playlistId}/songs/`;
    return this.http.get<any>(url).pipe(
      map(playlist => {
        return {
          id: playlist.id,
          playlistName: playlist.playlistName,
          coverImage: `${this.baseUrl}${playlist.coverImage}`,
          totalDuration: playlist.totalDuration,
          songs: playlist.songs.map((song: any) => ({
            id: song.id,
            title: song.songTitle,
            duration: song.duration,
            audio: `${this.baseUrl}${song.audio}`,
            artist:{
              artistName: song.album.artist.artistName,
              coverImage:  `${this.baseUrl}${song.album.artist.coverImage}`
            }
          }))
        };
      }),
      catchError(this.handleError)
    );
  }

  //Método para agregar una canción a una playlist seleccionada
  addSongToPlaylist(playlistId: number, songId: number): Observable<any> {
    const url = `${this.baseUrl}/api/playlist/add-song/`;
    const payload = {
      playlist_id: playlistId,
      song_id: songId,
    };

    return this.http.post(url, payload).pipe(
      catchError((error) => {
        console.error('Error adding song to playlist:', error);
        return throwError(error);
      })
    );
  }

  // Método para crear una nueva playlist
  createPlaylist(playlistData: FormData): Observable<any> {
    const url = `${this.baseUrl}/api/playlist/create/`;
    return this.http.post(url, playlistData).pipe(
      catchError((error) => {
        console.error('Error adding playlist:', error);
        return throwError(error);
      })
    );
  }

  // Método para eliminar una playlist por su ID
  deletePlaylist(playlistId: number): Observable<any> {
    const url = `${this.baseUrl}/api/playlist/${playlistId}/delete/`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError));
  }

  // Método para actualizar una playlist existente
  updatePlaylist(
    playlistId: number,
    playlistData: { playlistName: string; coverImage: File | null }
  ): Observable<any> {
    const url = `${this.baseUrl}/api/playlist/${playlistId}/update/`;
    const formData = new FormData();
    formData.append('playlistName', playlistData.playlistName);
    if (playlistData.coverImage) {
      formData.append(
        'coverImage',
        playlistData.coverImage,
        playlistData.coverImage.name
      );
    }
    return this.http.post(url, formData).pipe(catchError(this.handleError));
  }

  // Método para notificar a los suscriptores que las playlists han sido actualizadas
  notifyPlaylistsUpdated() {
    this.playlistsUpdated$.next();
  }

  // Observable que los componentes pueden suscribirse para escuchar actualizaciones de listas de reproducción
  onPlaylistsUpdated(): Observable<void> {
    return this.playlistsUpdated$.asObservable();
  }

  // Función para manejar errores de solicitud HTTP
  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    return throwError(error); // Propagar el error para manejarlo en el componente
  }

  //Método para eliminar una determinada canción de una determinada playlist
  removeSongFromPlaylist(playlistId: number, songId: number): Observable<any> {
    const url = `${this.baseUrl}/api/remove-song/${songId}/playlist/${playlistId}/`;
    return this.http.delete(url);
  }
}
