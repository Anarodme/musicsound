import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../Services/Album/album.service';
import { SongsService } from 'src/app/Services/Songs/songs.service';
import { ArtistService } from 'src/app/Services/Artists/artists.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-album',
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
    artists: any[] = [];
    artistId: number | undefined;
    albumes: any[] = [];

    currentArtistIndex: number = 0;
    artistSelected: string = '';
    currentIndex: number = 0;
    public currentArtistId: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private albumService: AlbumService,
        private SongSelectionService: SongsService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
          const artistId = params['artistId'];
          this.fetchAlbumsByArtistId(artistId);
          
        });
      }
        fetchAlbumsByArtistId(artist_id: number) {
            this.albumService.getAlbumByartist(artist_id).subscribe(
            (data: any[]) => {
                // Map the obtained data to a new album format
                this.albumes = data.map(album => ({
                    id: album.id,
                    albumTitle: album.albumTitle,
                    releaseDate: album.releaseDate,
                    totalDuration: album.totalDuration,
                    numberOfSongs: album.numberOfSongs,
                    coverImage: album.coverImage,
                    backgroundImage: album.backgroundImage,
                    artist_id: album.artist_id,
                }));
                // Log the albums to the console
                console.log('Albums:', this.albumes);
            },
            // Handle errors
            (error) => {
                console.error('Error fetching playlists:', error);
            }
        );
    }


    // Navigates to the songs page for a selected album and artist
    navigateToSong(album_Id: number) {
        this.router.navigate(['album', album_Id, 'songs']);
    }

    // Sets the selected album for song selection
    selectAlbum(album: any) {
        this.SongSelectionService.setSelectedAlbum(album);
    }

}
