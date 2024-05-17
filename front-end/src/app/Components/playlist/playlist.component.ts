import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService } from 'src/app/Services/Playlist/playlist.service';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
})
export class PlaylistComponent implements OnInit, OnDestroy {
  libraryId: number;
  playlists: any[] = [];
  playlists$: Observable<any[]>;
  selectedImage: File | null = null;
  showForm: boolean = false;
  newPlaylistName: string = '';
  playlistIdToEdit: number | null = null;
  showModal: boolean = false;

  private playlistsSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.libraryId = +params.get('libraryId');
      this.fetchPlaylistsByLibraryId(this.libraryId);
    });

    this.playlistsSubscription = this.playlistService
      .onPlaylistsUpdated()
      .subscribe(() => {
        this.loadPlaylists();
      });

    this.loadPlaylists();
  }

  ngOnDestroy() {
    if (this.playlistsSubscription) {
      this.playlistsSubscription.unsubscribe();
    }
  }

  fetchPlaylistsByLibraryId(libraryId: number) {
    this.loadPlaylists();
  }

  loadPlaylists() {
    this.playlists$ = this.playlistService
      .getPlaylistsByLibraryId(this.libraryId)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener listas de reproducción:', error);
          return throwError(error);
        })
      );

    this.playlistsSubscription = this.playlists$.subscribe(
      (data: any[]) => {
        this.playlists = data.map((playlist) => ({
          id: playlist.id,
          playlistName: playlist.playlistName,
          coverImage: playlist.coverImage,
        }));
      },
      (error) => {
        console.error('Error al suscribirse a listas de reproducción:', error);
      }
    );
  }

  navigateToSongs(playlistId: number) {
    this.router.navigate(['playlist', playlistId, 'songs']);
  }

  createNewPlaylist() {
    if (this.newPlaylistName.trim() !== '') {
      const playlistData = new FormData();
      playlistData.append('playlistName', this.newPlaylistName);
      playlistData.append('library', this.libraryId.toString());

      if (this.selectedImage) {
        playlistData.append(
          'coverImage',
          this.selectedImage,
          this.selectedImage.name
        );
      }

      this.playlistService.createPlaylist(playlistData).subscribe(
        (response) => {
          console.log('Lista de reproducción creada:', response);
          this.playlists.push(response);
          this.newPlaylistName = '';
          this.selectedImage = null;
          this.showForm = false;
        },
        (error) => {
          console.error('Error al crear la lista de reproducción:', error);
        }
      );
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  cancelCreation() {
    this.showForm = false;
    this.newPlaylistName = '';
  }

  openEditModal(playlist: any) {
    this.showModal = true;
    this.playlistIdToEdit = playlist.id;
    this.newPlaylistName = playlist.playlistName;
  }

  closeModal() {
    this.showModal = false;
    this.playlistIdToEdit = null;
    this.newPlaylistName = '';
  }

  updatePlaylist({
    playlistName,
    coverImage,
  }: {
    playlistName: string;
    coverImage: File | null;
  }) {
    if (!this.playlistIdToEdit) {
      return;
    }

    const updatedPlaylistData = {
      playlistName,
      coverImage,
    };

    this.playlistService
      .updatePlaylist(this.playlistIdToEdit, updatedPlaylistData)
      .subscribe(
        (response) => {
          console.log('Playlist actualizada:', response);
          const updatedPlaylistIndex = this.playlists.findIndex(
            (p) => p.id === this.playlistIdToEdit
          );
          if (updatedPlaylistIndex !== -1) {
            this.playlists[updatedPlaylistIndex].playlistName =
              response.playlistName;
            this.playlistService.notifyPlaylistsUpdated();
          }
          this.closeModal();
        },
        (error) => {
          console.error('Error actualizando playlist:', error);
        }
      );
  }

  deletePlaylist(playlistId: number) {
    if (confirm('¿Estás seguro de eliminar esta playlist?')) {
      this.playlistService.deletePlaylist(playlistId).subscribe(
        () => {
          // Eliminar la playlist localmente después de la eliminación exitosa en la BD
          this.playlists = this.playlists.filter((p) => p.id !== playlistId);
          console.log('Playlist eliminada correctamente.');
        },
        (error) => {
          console.error('Error al eliminar la playlist:', error);
          // Agregar lógica adicional de manejo de errores aquí, por ejemplo, mostrar una alerta
        }
      );
    }
  }
  
}
