import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  libraryId: number;

  constructor(private router: Router, private uService: UserService) {}

  ngOnInit() {
    this.uService.isAuth().then((data) => {
      if (data.value && data.userAuth) {
        this.uService.getMyLibrary(data.userAuth).subscribe(
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
  }

  //Método que redirige a la playlist.
  navigateToPlaylist(libraryId: number) {
    if (this.libraryId) {
      this.router.navigate(['/playlist', this.libraryId]);
    } else {
      console.error('No se ha encontrado un libraryId válido. Esperando respuesta del servicio.');
    }
  }
}
