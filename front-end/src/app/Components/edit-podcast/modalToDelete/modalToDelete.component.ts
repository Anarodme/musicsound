import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PodcastServiceService } from 'src/app/Services/Podcast/podcast-service.service';

@Component({
  selector: 'app-modalToDelete',
  templateUrl: './modalToDelete.component.html',
  styleUrls: ['./modalToDelete.component.css']
})
export class ModalToDeleteComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ModalToDeleteComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private podcastService:PodcastServiceService,private route:Router) { }

  ngOnInit() {
  }


  closeDialog(){
    this.dialogRef.close();
  }

  saveChanges(){

    this.podcastService.delete_podcast(this.data.idPodcast).subscribe((response)=>{
      console.log('Podcast eliminado con exito!')
    },(error)=>{
      console.log('El podcast no pudo ser eliminado!')
    });

    this.dialogRef.close();
    this.route.navigate(['/']);


  }

}
