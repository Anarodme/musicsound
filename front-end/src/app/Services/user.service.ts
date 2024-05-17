import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl:string = 'http://127.0.0.1:8000/';

constructor( private Http:HttpClient, private route:ActivatedRoute) { }

  registerUser(data: any): Observable<any> {
    return this.Http.post<any>(`${this.apiUrl}signup`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.Http.post<any>(`${this.apiUrl}login`, data);
  }

  logoutUser(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return this.Http.get(`${this.apiUrl}logout`,{headers});
  }


//----Verificar si el usuario se encuentra autenticado

  UserIsAuthenticated(): Observable<any>{

    const requestData = {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    };
    return this.Http.get<any>(`${this.apiUrl}registered-User`,requestData);
  }

isAuth(): Promise<any> {
  return new Promise<any>((resolve, reject) => {

    const suscripcion = this.UserIsAuthenticated().subscribe(
      (response) => {
        const data = {
          "value":response.authenticated,
          "userAuth":response.user_id,
          "username":response.username,
          "email":response.email
        }
        
        resolve(data);
        suscripcion.unsubscribe();
      },
      (error) => {
        const data = {
          "value":false
        }
        resolve(data);
        suscripcion.unsubscribe();
      },
    );
  });
}

//----------------------------------------------------------------------------


//-----Recuperacion de contraseña

emailRecuperacion(data: any): Observable<any> {
  return this.Http.post<any>(`${this.apiUrl}email`, data);
}

restablecerContraseña(data: any): Observable<any> {
  return this.Http.post<any>(`${this.apiUrl}rest-pass`, data);
}

editProfile(data:any):Observable<any>{
  return this.Http.post<any>(`${this.apiUrl}update/user`,data)
}


create_playlist(data: any): Observable<any> {
  return this.Http.post<any>(`${this.apiUrl}api/playlist/create/`, data);
}

getMyLibrary(userId:number){
  return this.Http.get<any>(`${this.apiUrl}api/user/${userId}/library/`);
}


}
