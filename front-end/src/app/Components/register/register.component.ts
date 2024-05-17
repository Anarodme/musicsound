import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  errorMessageU:string;
  errorMessageE:string;
  registrationError:boolean;

  data = {
    email:'',
    username:'',
    password:''
  }

  @ViewChild('myForm') myForm:NgForm;

  constructor(private uService:UserService, private route:Router){}

  onSubmit(){
    this.data.email = this.myForm.value.email;
    this.data.username = this.myForm.value.user;
    this.data.password = this.myForm.value.password;

    this.uService.registerUser(this.data).subscribe(
      (response) => {
        this.registrationError=false;
        this.route.navigate(['/login']);
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.errorMessageE,this.errorMessageU = "";
          if (error.error.type === 'Username') {
            this.errorMessageU = error.error.detail;
            this.registrationError=true;
          }else{
            this.errorMessageE = error.error.detail;
            this.registrationError=true;
          }
          
        } else {
          console.error('Error inesperado:', error);
        }
      }
    )
    
  }


}
