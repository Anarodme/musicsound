import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StreamsService {
  private apiUrl:string = 'http://127.0.0.1:8000/';

  constructor( private Http:HttpClient, private route:ActivatedRoute) { }

  getLiveStreams(): Observable<any> {
    return this.Http.get<any>(`${this.apiUrl}get-podcasts`, {});
  }

}