import { HttpErrorResponse } from '@angular/common/http';
import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.css']
})
export class AuthenticatedComponent{
  imagePath = '../../../assets/logo2.jpg';

  constructor(private uService:UserService,private route:Router){}

  logout(){
    this.uService.logoutUser().subscribe(
      (response) => {
        localStorage.removeItem('token');
        localStorage.removeItem('idUser');
        this.route.navigate(['login'])

      },
      (error) => {
        console.error('Error inesperado:', error);
      }
    )
  }

}
