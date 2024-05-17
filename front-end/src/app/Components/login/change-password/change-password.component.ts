import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit,OnDestroy {

  @ViewChild('myForm') myForm:NgForm;
  private token:string;
  urlSuscripcion:Subscription;
  resetSuscripcion:Subscription;
  redirect:boolean = false;
  mess:string = ''

  data = {
    "token": "",
    "password": ""
  }
  constructor(private route:ActivatedRoute,private uService:UserService) { }

  ngOnInit() {
    this.urlSuscripcion = this.route.queryParams.subscribe(
      params => {
        this.token = params['token'];
      }
    );
  }
  ngOnDestroy(){
    this.urlSuscripcion.unsubscribe();
    this.resetSuscripcion.unsubscribe();
  }

  onSubmit(){
    this.data.token = this.token;
    this.data.password = this.myForm.value.passwordConfirm;
    this.resetSuscripcion = this.uService.restablecerContraseña(this.data).subscribe(
      (response)=>{
        this.mess = response.message;
        this.redirect=true;

      },
      (error)=>{
        this.mess = error.error.error;
        this.redirect=false;
      }
    );

  }

}
