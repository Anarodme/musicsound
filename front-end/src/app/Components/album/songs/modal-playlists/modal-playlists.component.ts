import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlaylistService } from 'src/app/Services/Playlist/playlist.service';
import { ActivatedRoute, Router  } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';



@Component({
  selector: 'app-modal-playlists',
  templateUrl: './modal-playlists.component.html',
  styleUrls: ['./modal-playlists.component.css']
})
export class ModalPlaylistsComponent {

  playlists: any[] = [];
  libraryId: number;

  constructor(
    private dialogRef: MatDialogRef<ModalPlaylistsComponent>,
    private playlistService: PlaylistService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any // Inyectar los datos pasados al modal


  ) { }

  ngOnInit() {
    this.userService.isAuth().then((data) => {
      if (data.value && data.userAuth) {
        this.userService.getMyLibrary(data.userAuth).subscribe(
          (response) => {
            if (response && response.length > 0) {
              this.libraryId = response[0].id;
              this.fetchPlaylistsByLibraryId(this.libraryId);
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
      console.log('Selected Song:', this.data.selectedSong.id);

    });
  }
  // Obtener las listas de reproducción por el ID de la biblioteca
  fetchPlaylistsByLibraryId(libraryId: number) {
    this.playlistService.getPlaylistsByLibraryId(libraryId).subscribe(
      (data: any[]) => {
        // Mapear los datos obtenidos a un nuevo formato de lista de reproducción
        this.playlists = data.map(playlists => ({
          id: playlists.id,
          playlistName: playlists.playlistName,
          coverImage: playlists.coverImage, 
        }));
        console.log('Listas de reproducción:', this.playlists);
      },
      (error) => {
        console.error('Error al obtener listas de reproducción:', error);
      }
    );
  }

  saveSong(playlistId: number, songId: number): void {
    this.playlistService.addSongToPlaylist(playlistId, songId).subscribe(
      response => {
        console.log(`Canción agregada a la playlist con éxito:`, response);
        this.dialogRef.close();
      },
      error => {
        console.error('Error al agregar la canción a la playlist:', error);
      }
    );
  }
  
  closeDialog() {
    this.dialogRef.close();
  }

  
}
