import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaService } from '../../../Services/player-control/media.service';
import { AlbumService } from 'src/app/Services/Album/album.service';
import { FavoritesService } from 'src/app/Services/Favorites/favorites.service';
import { ModalPlaylistsComponent } from './modal-playlists/modal-playlists.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/Services/user.service';


@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {
  [x: string]: any;

  album_Id: number | undefined;
  selectedSong: any = null;
  currentSongIndex: number = -1;
  albums: any;
  libraryId: number;


  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private albumService: AlbumService,
    private FavoritesService: FavoritesService,
    private dialog: MatDialog,
    private userService: UserService,

  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.album_Id = +params.get('albumId');
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

      if (this.album_Id) {
        this.fetchAlbums(this.album_Id);
      }
    });
    this.mediaService.currentSong$.subscribe((song) => {
      this.selectedSong = song;
    });
  }

  fetchAlbums(album_Id: number) {
    this.albumService.getSongOfAlbum(album_Id).subscribe(
      (data: any) => {
        this.albums = {
          songs: data.map((song: any) => ({
            id: song.id,
            songTitle: song.songTitle,
            audio: song.audio,
            duration: song.duration,
            album: {
              id: song.album.id,
              albumTitle: song.album.albumTitle,
              releaseDate: song.album.releaseDate,
              coverImage: song.album.coverImage,
              artist: {
                id: song.album.artist.id,
                artistName: song.album.artist.artistName,
                description: song.album.artist.description,
              },
            },
          })),
        };
        console.log('Playlist:', this.playlist);
      },
      (error) => {
        console.error('Error fetching playlist:', error);
      }
    );
  }

  // Toggles the favorite status of a song
  toggleFavorite(song: any) {
    // Toggle the favorite status of the song
    song.favorite = !song.favorite;

    // If the song is marked as favorite, add it to the liked songs
    if (song.favorite) {
      const songId = song.id;
      this.FavoritesService.addToLikedSongs(songId, this.libraryId);
      console.log(songId);
    }
  }
  playSong(song: any) {
    try {
      console.log('Canción seleccionada para reproducir:', song);
      this.mediaService.setCurrentSong({ ...song, songs: this.albums.songs });
      this.selectedSong = { ...song, songs: this.albums.songs };

    } catch (error) {
      console.error('Error playing song:', error);
    }
  }



  // Opens the modal dialog for selecting a playlist
  modalPlaylist(selectedSong: any) {
    // Open the modal dialog with the selected song data
    const dialogRef = this.dialog.open(ModalPlaylistsComponent, {
      data: { selectedSong }
    });

    // Subscribe to the dialog close event
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


}
