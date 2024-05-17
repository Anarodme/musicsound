import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})

export class MusicPlayerComponent {
  @ViewChild('audioPlayer') audioPlayer: ElementRef | undefined;

  // Playback state variables
  isPlaying: boolean = false;
  currentTime: string = '0:00';
  duration: string = '0:00';
  progressInterval: any;
  progressValue: number = 0;

  // Array of audio URLs
  audios: string[] = [  
  '../../../assets/The Power of Equality-RHCP.mpeg',
  '../../../assets/Breaking the girl-RHCP.mpeg',
  '../../../assets/I could have lied-RHCP.mpeg',
  '../../../assets/If you have to ask-RHCP.mpeg'
  ];

   // Array of song names
  audioNames: string[] = [  
    'The Power Of Equality',
    'Breaking The Girl',
    'I Could Have Lied',
    'If You Have To Ask'
  ];
  
  //Current playback type (Album-Podcast-Playlist-Favorites)
  currentPlayingType: string = 'ÁLBUM'; 

  // Album-Podcast-Playlist-Favorites name
  content_name: string = 'Blood Sugar Sex Magik';

  // Album-Podcast-Playlist-Favorites cover URL
  content_cover: string = 'https://upload.wikimedia.org/wikipedia/en/5/5e/RHCP-BSSM.jpg';

  // Artist name
  artist: string = 'Red Hot Chilli Peppers';
  
  // Index of the currently playing song
  currentSongIndex: number = 0;  

  // After the view has been initialized, set up an event listener for the 'ended' event on the audio player
  ngAfterViewInit() {
    if (this.audioPlayer) {
      const audio = this.audioPlayer.nativeElement as HTMLAudioElement;
      audio.addEventListener('ended', () => {
        this.play_next_song();
      });
    }
  }

  // Toggle play/pause of the current song
  play_pause_song() {
    const audio = this.audioPlayer.nativeElement as HTMLAudioElement;
    if (audio.paused) {
      audio.play();
      this.isPlaying = true;
      this.progressInterval = setInterval(() => {
        this.updateProgressBar();
      }, 1000);
    } else {
      audio.pause();
      this.isPlaying = false;
      clearInterval(this.progressInterval);
    }
  }

  // Play the next song
  play_next_song() {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.audios.length;
    this.playSong(this.currentSongIndex);
  }

  // Play the previous song
  play_previous_song() {
    this.currentSongIndex = (this.currentSongIndex - 1 + this.audios.length) % this.audios.length;
    this.playSong(this.currentSongIndex);
  }

   // Play the song at the specified index
  playSong(index: number) {
    const audio = this.audioPlayer.nativeElement as HTMLAudioElement;
    audio.src = this.audios[index];
    audio.load();
    audio.play();
    this.isPlaying = true;
    this.updateProgressBar();
    this.currentSongIndex = index; 
  }

  // Get the icon for the play/pause button
  getPlayButtonIcon() {
    return this.isPlaying ? 'fa-pause' : 'fa-play';
  }

  // Update the progress bar and current time display
  updateProgressBar() {
    const audio = this.audioPlayer.nativeElement as HTMLAudioElement;
    if (audio.readyState >= 2) { 
      const currentMinutes = Math.floor(audio.currentTime / 60);
      const currentSeconds = Math.floor(audio.currentTime % 60);
      const durationMinutes = Math.floor(audio.duration / 60);
      const durationSeconds = Math.floor(audio.duration % 60);
      this.currentTime = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
      this.duration = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
      this.progressValue = (audio.currentTime / audio.duration) * 100;
    }
  }

  // Handle change in progress bar
  handleProgressBar(event: any) {
    const audio = this.audioPlayer.nativeElement as HTMLAudioElement;
    const newPosition = (event.target.value / 100) * audio.duration;
    audio.currentTime = newPosition;
  }
}