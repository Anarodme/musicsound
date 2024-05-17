import { Component } from '@angular/core';
import { PodcastBroadcastService } from 'src/app/Services/Podcast/podcast-broadcast.service';
import { StreamsService } from 'src/app/Services/Podcast/podcast-get.service';
import { ModalComponent } from 'src/app/Components/record-podcast/live-streaming/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live-streaming',
  templateUrl: './live-streaming.component.html',
  styleUrls: ['./live-streaming.component.css']
})
export class LiveStreamingComponent {
  micEncendido: boolean = false;
  musicOn: boolean = false;
  streamsEnVivo: any[];
  timerInterval: any;
  file: any;

  constructor(
    private broadcast:PodcastBroadcastService,
    private route:Router,
    private streamsService: StreamsService,
    private dialog: MatDialog
  ){}

  ngOnInit() {
    this.timerInterval = setInterval(() => {
      this.getLiveStreams(); 
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval); // Desactiva el intervalo al salir del componente
  }

  openModal(){
    this.dialog.open(ModalComponent);
  }

  getLiveStreams(): void {
    this.streamsService.getLiveStreams()
      .subscribe(
        data => {
          this.streamsEnVivo = data;
          console.log('Datos de transmisiones en vivo:', this.streamsEnVivo);
        },
        error => {
          console.error('Error al obtener los datos de transmisiones en vivo:', error.error);
        }
      );
  }

  onFileChange(event) {
    this.file = event.target.files[0];
    console.log(this.file)
    if (this.file) {
      this.broadcast.uploadFile(this.file).subscribe(
        (resquest) => {
          console.log('Archivo subido exitosamente:', resquest);
        },
        (error) => {
          console.error('Error al subir archivo:', error.error);
        }
      );
    }
  }

  toggleMicrophone() {
    this.broadcast.microphoneControl().subscribe(
      (resquest) => {
        console.log(resquest);
      },
      (error) => {
        console.error('Error:', error.error);
      }
    );
  }

  togglePlayMusic(){
    this.broadcast.musicControl().subscribe(
      (resquest) => {
        console.log(resquest);
      },
      (error) => {
        console.error('Error:', error.error);
      }
    );
  }

  stopTransmission() {
    this.broadcast.stopTransmission().subscribe(
      (resquest) => {
        console.log(resquest);
        this.route.navigate(['/recordPodcast']);
      },
      (error) => {
        console.error('Error:', error.error);
      },
    );
  }
}