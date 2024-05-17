import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMessage:string;
  loginError:boolean;

  data = {
    username:'',
    password:''
  }

  @ViewChild('myForm') myForm:NgForm;

  constructor(private uService:UserService,private route:Router,private dialog: MatDialog){}

  onSubmit(){
    this.data.username = this.myForm.value.username;
    this.data.password = this.myForm.value.password;

    this.uService.loginUser(this.data).subscribe(
      (response) => {
        
        this.loginError = false;
        localStorage.removeItem('token');
        localStorage.setItem('token', response.token);
        localStorage.removeItem('idUser');
        localStorage.setItem('idUser', response.user.id);
        this.route.navigate(['']);

      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          console.log(error)
          this.errorMessage = error.error.detail;
          this.loginError = true;
        } else {
          console.error('Error inesperado:', error);
        }
      }
    )

  
  }

  openModal(){
    this.dialog.open(ModalComponent);
  }

}
