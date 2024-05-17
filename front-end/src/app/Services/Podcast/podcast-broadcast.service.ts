import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PodcastBroadcastService {
  private apiUrl:string = 'http://127.0.0.1:8000/';
  
  constructor( private Http:HttpClient, private route:ActivatedRoute) { }
  
  checkBroadcast(data: any): Observable<any> {
    return this.Http.post<any>(`${this.apiUrl}check-broadcast`, data);
  }

  startTransmission(data: any): Observable<any> {
    return this.Http.post<any>(`${this.apiUrl}start-broadcast`, data);
  }

  microphoneControl(): Observable<any> {
    return this.Http.post<any>(`${this.apiUrl}microphone-control`, {});
  }

  musicControl(): Observable<any> {
    return this.Http.post<any>(`${this.apiUrl}music-control`, {});
  }

  uploadFile(file: File): Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    return this.Http.post<any>(`${this.apiUrl}upload-file`, formData);
  }

  stopTransmission(): Observable<any>{
    return this.Http.post<any>(`${this.apiUrl}stop-broadcast`, {})
  }

}