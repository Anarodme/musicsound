import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PodcastServiceService } from 'src/app/Services/Podcast/podcast-service.service';
import { UserService } from 'src/app/Services/user.service';
import { ModalToDeleteComponent } from './modalToDelete/modalToDelete.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-podcast',
  templateUrl: './edit-podcast.component.html',
  styleUrls: ['./edit-podcast.component.css']
})
export class EditPodcastComponent implements OnInit ,OnDestroy{
  @ViewChild('myForm') myForm:NgForm;
  action:string;

  title = '';
  titleBtn = '';
  edit:boolean = false;

  suscription:Subscription;
  suscriptionPodService:Subscription;
  suscriptionPodServiceEdit:Subscription;
  selectedFile:File|null=null;
  podcastCategories = [];

  //Edit
  myPodcasts = [];
  myPodcastId = '';
  currentUser:string;
  

  constructor(private uService:UserService,private podcastService:PodcastServiceService,private ActivatedRoute:ActivatedRoute, private route:Router,private dialog: MatDialog){
    this.suscriptionPodService=this.podcastService.GetAllPodcastCategories().subscribe((response)=>{
      response.forEach(element => {
        this.podcastCategories.push(element)
      });
    });
  }

  ngOnInit(){

    this.ActivatedRoute.params.subscribe(params => {
      this.action = params.id;
    });


    if (this.action === 'Crear') {
        this.title = 'CREAR';
        this.titleBtn = 'Crear';

    }else if(this.action === 'Editar'){

      this.title = 'EDITAR';
      this.titleBtn = 'Editar';
      this.edit = true;

      this.uService.isAuth().then((datos)=>{
        this.currentUser = datos.userAuth;
        this.suscriptionPodServiceEdit=this.podcastService.GetMyPodcasts(parseInt(this.currentUser)).subscribe((response)=>{
          response.forEach(element => {
            this.myPodcasts.push(element)
          });
          
        })
      })

    }
    
  }

  ngOnDestroy() {
    this.suscriptionPodService.unsubscribe()
  }


  onFileSelected(event:any){
    this.selectedFile = event.target.files[0];
  }

  onChangeMyPodcast(){
    const podcast = this.myPodcasts.find(objeto => objeto.id === parseInt(this.myPodcastId));
    if (podcast) {
      this.myForm.control.patchValue({
        podName: podcast.podcastTitle,
        podCategories:podcast.category.id,
        podDescription:podcast.description
      });
    }else{
      this.myForm.control.patchValue({
        podName: '',
        podCategories:'',
        podDescription:''
      });
    }
    
  }

  onSubmit() {

    if (this.action === 'Crear') {
      const formData = new FormData();
      
      formData.append('podcastTitle', this.myForm.value.podName);
      formData.append('category', this.myForm.value.podCategories);
      formData.append('description', this.myForm.value.podDescription);
      formData.append('coverImage', this.selectedFile);
    
      this.uService.isAuth().then((datos) => {
        formData.append('user', datos.userAuth);
    
        this.podcastService.create_podcast(formData).subscribe(
          (request) => {
            alert("El podcast fue creado con éxito!")
          },
          (error) => {
            alert("El podcast no pudo ser creado con éxito!")
            console.log(error.error);
          }
        ).add(() => {
          // Desuscribirse después de completar la suscripción
          this.suscription.unsubscribe();
        });
    
      }).catch((error) => {
        console.log("Error al autenticar:", error);
      });

    }



    else if (this.action === 'Editar') {
      const formData = new FormData();
      formData.append('user', this.currentUser);
      formData.append('podcastId', this.myPodcastId);
      formData.append('podcastTitle', this.myForm.value.podName);
      formData.append('category', this.myForm.value.podCategories);
      formData.append('description', this.myForm.value.podDescription);
      if (this.selectedFile !== null) {
        formData.append('coverImage', this.selectedFile);
      }
      
      this.podcastService.update_podcast(formData).subscribe(
        (request) => {
          alert("El podcast fue editado con éxito!")
        },
        (error) => {
          alert("No se logro editar el podcast con éxito!")
          console.log(error.error);
        }
      ).add(() => {
        // Desuscribirse después de completar la suscripción
        this.suscription.unsubscribe();
      });

    }

    this.route.navigate(['/']);

  }

  openModal(){
    this.dialog.open(ModalToDeleteComponent,{data:{idPodcast:this.myPodcastId}});
  }
    

}


