import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PodcastBroadcastService } from 'src/app/Services/Podcast/podcast-broadcast.service';
import { AudioDeviceService } from 'src/app/Services/Podcast/podcast-devices.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-record-podcast',
  templateUrl: './record-podcast.component.html',
  styleUrls: ['./record-podcast.component.css']
})

export class RecordPodcastComponent implements OnInit {
  audioDevices: any[];
  responseData: any;
  transmissionError: boolean;
  selectedMicrophone: any;
  transmissionStarted: boolean = false; // Estado de la transmisión
  data = {
    episodename:'',
    episodedescription:'',
    deviceId: 0,
    maxChannels: 0 
  };

  @ViewChild('myForm') myForm:NgForm;

  constructor(
    private broadcast:PodcastBroadcastService,
    private route:Router,
    private dialog: MatDialog,
    private audioDeviceService: AudioDeviceService
  ){}

  ngOnInit(): void {
    this.audioDeviceService.getAudioDevices().subscribe(
      (data) => {
        this.audioDevices = data.devices;
        if (this.audioDevices.length > 0) {
          this.selectedMicrophone = this.audioDevices[0];
          this.data.deviceId = this.selectedMicrophone.id;
          this.data.maxChannels = this.selectedMicrophone.max_input_channels;
        }
      },
      (error) => {
        console.error('Error al obtener los dispositivos de audio:', error.error);
      }
    );
  }

  checkTransmission(){
    this.data.episodename = this.myForm.value.nombreepisodio;
    this.data.episodedescription = this.myForm.value.descripcionepisodio;
    this.data.deviceId = this.selectedMicrophone.id;
    this.data.maxChannels = this.selectedMicrophone.max_input_channels;

    this.broadcast.checkBroadcast(this.data).subscribe(
      (resquest) => {
        console.log(resquest)
        this.startTransmission();
        this.route.navigate(['/liveStreaming']);
      },
      (error) => {
        console.log(error.error)
      }
    );
  }

  startTransmission() {
    this.data.episodename = this.myForm.value.nombreepisodio;
    this.data.episodedescription = this.myForm.value.descripcionepisodio;
    this.data.deviceId = this.selectedMicrophone.id;
    this.data.maxChannels = this.selectedMicrophone.max_input_channels;

    this.broadcast.startTransmission(this.data).subscribe(
      (resquest) => {
        this.transmissionError = false;
        console.log(resquest);
      },
      (error) => {
        this.transmissionError = true;
        console.log(error.error);
      }
    );
  }
}