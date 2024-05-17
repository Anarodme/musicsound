import { Component, OnInit } from '@angular/core';
import { Artist } from './artist.model';
import { ArtistService } from 'src/app/Services/Artists/artists.service';
import { catchError, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumService } from 'src/app/Services/Album/album.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {


  listOfArtist: Artist[];
  artists: any[] = [];
  artistSelected: string = '';
  coverImages: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private artistService: ArtistService,
    private albumService: AlbumService 
  ) { }


  ngOnInit() {
    this.loadArtists();
  }

  loadArtists() {
    this.artistService.getArtists().subscribe(
      (artists: any[]) => {

        this.artists = artists.map(artists => ({
          id: artists.id,
          artistName: artists.artistName,
          description: artists.description,
          coverImage: artists.coverImage,
        }));
      },
      

      (error) => {
        console.error('Error al obtener artists:', error);
      }
    );
  }
  selectArtist(artistId: number) {
    this.router.navigate(['/album', artistId]);
  }



}


