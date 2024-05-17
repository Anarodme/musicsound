import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit,OnDestroy {
  emailIsValid: boolean = false;
  Mess:string = '';
  emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  suscription:Subscription;
  @ViewChild('Email')email:ElementRef;
  data = {
    "email":''
  }


  constructor(private dialogRef: MatDialogRef<ModalComponent>,private uService:UserService) { }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  checkEmailValidity(email: string) {
    this.emailIsValid = new RegExp(this.emailPattern).test(email);
  }

  closeDialog(){
    this.dialogRef.close();
  }

  saveChanges(){
    this.data.email=this.email.nativeElement.value;
    this.suscription = this.uService.emailRecuperacion(this.data).subscribe(
      (response)=>{
        this.Mess = response.message;
      },
      (error)=>{
        this.Mess = error.error.error;
      }
    ) 
  }

}
