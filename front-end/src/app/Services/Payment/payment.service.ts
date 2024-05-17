import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://127.0.0.1:8000'; 

  constructor(private http: HttpClient) { }

  procesarCompra(user_id: number): Observable<any> {
    const url = `${this.apiUrl}/api/update_subscription_premium/`;
    const body = { user_id: user_id };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    return this.http.post(url, body, { headers }).pipe(
      catchError((error) => {
        // Manejar errores aquí
        console.error('Error al procesar la compra:', error);
        // Puedes lanzar un error personalizado o retornar un observable de error
        return throwError('Error al procesar la compra');
      })
    );
  }
}
