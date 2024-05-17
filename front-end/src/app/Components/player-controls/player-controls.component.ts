import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { MediaService } from 'src/app/Services/player-control/media.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.css'],
})
export class PlayerControlsComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer', { static: true })
  audioPlayer!: ElementRef<HTMLAudioElement>;

  @Input() set selectedSong(song: any) {
    if (song) {
      this._selectedSong = song;
      this.loadSong(song);
    }
  }
  @Input() songs: any[] = [];

  private _selectedSong: any;
  private currentSongSubscription: Subscription;
  playIcon: string = 'fa-play';
  audioContext: AudioContext | null = null;
  isPlaying: boolean = false;
  progressInterval: any;

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    this.setupAudioEvents();
    this.audioContext = new AudioContext();

    this.currentSongSubscription = this.mediaService.currentSong$.subscribe(
      (song) => {
        this.selectedSong = song;
      }
    );

    this.mediaService.currentAlbum$.subscribe((album) => {
      if (album) {
        this.songs = album.songs;
        this.resetPlayer();
      }
    });
  }

  ngOnDestroy() {
    this.pause();
    this.audioPlayer.nativeElement.removeEventListener(
      'ended',
      this.handleEnded.bind(this)
    );
    this.audioPlayer.nativeElement.removeEventListener(
      'timeupdate',
      this.handleTimeUpdate.bind(this)
    );
    clearInterval(this.progressInterval);
    this.currentSongSubscription.unsubscribe();
  }

  setupAudioEvents() {
    this.audioPlayer.nativeElement.addEventListener(
      'ended',
      this.handleEnded.bind(this)
    );
    this.audioPlayer.nativeElement.addEventListener(
      'timeupdate',
      this.handleTimeUpdate.bind(this)
    );
  }

  handleEnded() {
    this.playNextSong();
  }

  loadSong(song: any) {
    if (song) {
      this.resetPlayer();
      this._selectedSong = song;
      this.setAudioSource(song.audio);
      this.printNextAndPreviousSongs();
    }
  }

  play() {
    if (this.audioPlayer && this.audioPlayer.nativeElement && this._selectedSong) {
      this.audioPlayer.nativeElement.play().then(() => {
        console.log('Reproduciendo...');
        this.playIcon = 'fa-pause';
        this.isPlaying = true;
        this.startProgressInterval();
      }).catch(error => {
        console.error('Error al reproducir el audio:', error);
      });
    }
  }

  pause() {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      this.audioPlayer.nativeElement.pause();
      console.log('Pausado...');
      this.playIcon = 'fa-play';
      this.isPlaying = false;
      clearInterval(this.progressInterval);
    }
  }

  togglePlayPause() {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      if (this.audioPlayer.nativeElement.paused) {
        this.play();
      } else {
        this.pause();
      }
    }
  }

  selectAlbum(album: any) {
    this.mediaService.setCurrentAlbum(album);
  }

  printNextAndPreviousSongs() {
    if (this.songs && this.songs.length > 0 && this._selectedSong) {
      const currentIndex = this.songs.findIndex(
        (song) => song.id === this._selectedSong.id
      );

      const previousIndex =
        (currentIndex - 1 + this.songs.length) % this.songs.length;
      const nextIndex = (currentIndex + 1) % this.songs.length;

      const previousSong = this.songs[previousIndex];
      const nextSong = this.songs[nextIndex];

      console.log('Canción actual:', this._selectedSong);
      console.log('Canción anterior:', previousSong);
      console.log('Siguiente canción:', nextSong);
    }
  }

  playNextSong() {
    if (this.songs && this.songs.length > 0 && this._selectedSong) {
      const currentIndex = this.songs.findIndex(
        (song) => song.id === this._selectedSong.id
      );
      const nextIndex = (currentIndex + 1) % this.songs.length;
      const nextSong = this.songs[nextIndex];
      if (nextSong) {
        this.selectedSong = nextSong;
      }
    }
  }

  playPreviousSong() {
    if (this.songs && this.songs.length > 0 && this._selectedSong) {
      const currentIndex = this.songs.findIndex(
        (song) => song.id === this._selectedSong.id
      );
      const previousIndex =
        (currentIndex - 1 + this.songs.length) % this.songs.length;
      const previousSong = this.songs[previousIndex];
      if (previousSong) {
        this.selectedSong = previousSong;
      }
    }
  }

  handleTimeUpdate(event: any) {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      const progress =
        (this.audioPlayer.nativeElement.currentTime /
          this.audioPlayer.nativeElement.duration) *
        100;
      const progressBar = document.getElementById(
        'progressBar'
      ) as HTMLInputElement;
      if (progressBar) {
        progressBar.value = progress.toString();
      }
    }
  }

  handleProgressBar(event: any) {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      const progress = event.target.value;
      const duration = this.audioPlayer.nativeElement.duration;

      if (!isNaN(duration) && isFinite(duration)) {
        const newTime = (duration * progress) / 100;
        if (!isNaN(newTime) && isFinite(newTime)) {
          this.audioPlayer.nativeElement.currentTime = newTime;
        }
      }
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  startProgressInterval() {
    clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      if (this.audioPlayer && this.audioPlayer.nativeElement) {
        const progress =
          (this.audioPlayer.nativeElement.currentTime /
            this.audioPlayer.nativeElement.duration) *
          100;
        const progressBar = document.getElementById(
          'progressBar'
        ) as HTMLInputElement;
        if (progressBar) {
          progressBar.value = progress.toString();
        }
      }
    }, 1000);
  }

  setAudioSource(audioUrl: string) {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      this.audioPlayer.nativeElement.src = audioUrl;
      this.audioPlayer.nativeElement.load();
    }
  }
  
  resetPlayer() {
    this.pause();
    this._selectedSong = null;
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      this.audioPlayer.nativeElement.src = '';
    }
    this.playIcon = 'fa-play';
    this.isPlaying = false;
    clearInterval(this.progressInterval);
  }
  }