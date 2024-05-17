import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PodcastServiceService {
  private apiUrl:string = 'http://127.0.0.1:8000/';

  constructor(private Http:HttpClient) { }


  //Obtener las categorías de los podcasts
  GetAllPodcastCategories(): Observable<any> {
    const url = `${this.apiUrl}PodcastCategories/`;
    return this.Http.get<any>(url);

  }

  //Obtener todos los podcasts
  GetMyPodcasts(idUser:number): Observable<any> {
    return this.Http.get<any>(`${this.apiUrl}api/user/${idUser}/podcasts/`);
  }

    // Obtener podcasts por category ID
    getPodcastsByCategory(categoryId: number): Observable<any> {
      const url = `${this.apiUrl}api/podcast/${categoryId}/`;
      return this.Http.get<any>(url).pipe()
    
    }
  
    // Obtener lods episodios de un podcast
    getEpisodesByPodcastId(podcast_id: number): Observable<any[]> {
      const url = `${this.apiUrl}api/podcast/${podcast_id}/episodes/`;
      return this.Http.get<any[]>(url).pipe();
    }


  create_podcast(data: any): Observable<any> {
    return this.Http.post<any>(`${this.apiUrl}api/podcasts/create/`,data);
  }
  
  update_podcast(data: any): Observable<any> {
    return this.Http.post<any>(`${this.apiUrl}api/podcasts/update/`,data);
  }

  delete_podcast(idPodcast:number): Observable<any> {
    return this.Http.delete<any>(`${this.apiUrl}api/podcast/${idPodcast}/delete/`);
  }


  getPodcastsByList(data:any): Observable<any> {
    return this.Http.post<any>(`${this.apiUrl}api/get/podcasts/`,data);
  }


  
}

