import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from 'src/app/Services/Playlist/playlist.service';
import { MediaService } from 'src/app/Services/player-control/media.service';

@Component({
  selector: 'app-songs-playlist',
  templateUrl: './songs-playlist.component.html',
  styleUrls: ['./songs-playlist.component.css'],
})
export class SongsPlaylistComponent implements OnInit {
  playlistId: number | undefined;
  selectedSong: any = null;
  playlist: any;
  totalDurationInSeconds: number = 0;

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private mediaService: MediaService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.playlistId = +params.get('playlistId');
      if (this.playlistId) {
        this.fetchPlaylist(this.playlistId);
      }
    });

    this.mediaService.currentSong$.subscribe((song) => {
      this.selectedSong = song;
    });
  }

  // Fetch playlist by playlistId
  fetchPlaylist(playlistId: number) {
    this.playlistService.getPlaylist(playlistId).subscribe(
      (data: any) => {
        this.playlist = {
          id: data.id,
          playlistName: data.playlistName,
          coverImage: data.coverImage,
          totalDuration: data.totalDuration,
          songs: data.songs.map((song: any) => ({
            id: song.id,
            title: song.title,
            duration: song.duration,
            audio: song.audio,
            artist: {
              artistName: song.artist.artistName,
              coverImage: song.artist.coverImage,
            },
          })),
        };
        // Calcular la duración total en segundos
        this.totalDurationInSeconds = this.formatHH_MM_SS(this.playlist.songs);
      },
      (error) => {
        console.error('Error fetching playlist:', error);
      }
    );
  }

  // Eliminar una canción de la playlist
  removeSong(song: any) {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar la canción "${song.title}"?`
    );

    if (confirmDelete) {
      console.log('Eliminando canción:', song);

      this.playlistService
        .removeSongFromPlaylist(this.playlist.id, song.id)
        .subscribe(
          (response) => {
            this.fetchPlaylist(this.playlistId); // Actualizar la playlist después de eliminar la canción
          },
          (error) => {
            console.error('Error al eliminar la canción:', error);
          }
        );
    }
  }

  // Play songs
  playSong(song: any) {
    try {
      console.log('Canción seleccionada para reproducir:', song);
      this.mediaService.setCurrentSong({ ...song, songs: this.playlist.songs });
      this.selectedSong = { ...song, songs: this.playlist.songs };
      console.log('Canción seleccionada:', this.selectedSong);
    } catch (error) {
      console.error('Error playing song:', error);
    }
  }

  // Calcular la duración total en segundos
  formatHH_MM_SS(songs: any[]): number {
    let totalSeconds = 0;

    // Iterar sobre todas las canciones y sumar sus duraciones
    songs.forEach((song) => {
      const durationParts = song.duration.split(':'); // Separar la duración en partes (hh:mm:ss)
      const hours = parseInt(durationParts[0], 10);
      const minutes = parseInt(durationParts[1], 10);
      const seconds = parseInt(durationParts[2], 10);

      // Convertir la duración a segundos y sumar al total
      totalSeconds += hours * 3600 + minutes * 60 + seconds;
    });

    return totalSeconds;
  }

  // Función para formatear la duración a mm:ss
  formatMM_SS(duration: string): string {
    const durationParts = duration.split(':'); // Separar la duración en partes (hh:mm:ss)
    const minutes = parseInt(durationParts[1], 10);
    const seconds = parseInt(durationParts[2], 10);

    // Formatear los componentes en mm:ss
    const formattedMinutes = ('0' + minutes).slice(-2);
    const formattedSeconds = ('0' + seconds).slice(-2);

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  // Función para formatear la duración total en hh:mm:ss
  formatDuration(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    // Formatear los componentes en hh:mm:ss
    const formattedHours = ('0' + hours).slice(-2);
    const formattedMinutes = ('0' + remainingMinutes).slice(-2);
    const formattedSeconds = ('0' + remainingSeconds).slice(-2);

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}
