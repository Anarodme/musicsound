import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private currentSongSource = new BehaviorSubject<any>(null);
  currentSong$ = this.currentSongSource.asObservable();
 private currentAlbumSource = new BehaviorSubject<any>(null);
  currentAlbum$ = this.currentAlbumSource.asObservable();

  constructor() {}

  setCurrentSong(song: any) {
    this.currentSongSource.next(song);
  }
  setCurrentAlbum(album: any) {
    this.currentAlbumSource.next(album);
  }
}