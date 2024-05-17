import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  private selectedSongSubject = new BehaviorSubject<any>(null);
  selectedSong = this.selectedSongSubject.asObservable();
  private selectedAlbumSubject = new BehaviorSubject<any>(null);
  selectedAlbum = this.selectedAlbumSubject.asObservable();
  likedSongsPodcast: any[] = []; // Lista de canciones favoritas
  allSongs: any[] = []; // Lista de todas las canciones

  private apiUrl = 'http://127.0.0.1:8000'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) { }

  setSelectedSong(song: any, index: number) {
    this.selectedSongSubject.next({ song, index });
  }

  getSelectedSong(): any {
    return this.selectedSongSubject.value;
  }


  setSelectedAlbum(album: any) {
    this.selectedAlbumSubject.next(album);
  }

  getSelectedAlbum(): any {
    return this.selectedAlbumSubject.value;
  }  


  getSongsByList(data:any){
    return this.http.post<any>(`${this.apiUrl}/api/get/songs/`, data);
  }
  



}
