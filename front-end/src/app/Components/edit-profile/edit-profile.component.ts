import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {

  idUser:number;
  username:string='';
  email:string='';

  constructor(private uService:UserService,private router:Router){
    this.uService.isAuth().then((datos)=>{
      this.idUser=datos.userAuth;
      this.username=datos.username;
      this.email=datos.email;
    })
  }


  saveProfile(){
    const data = {
      "id":this.idUser,
      "username":this.username,
      "email":this.email
    }

    this.uService.editProfile(data).subscribe((response)=>{
      this.router.navigate(['/']);
    },(error)=>{
      console.log(error.error)
    })

  }

}
