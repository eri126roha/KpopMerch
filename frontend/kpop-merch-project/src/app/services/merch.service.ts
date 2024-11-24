import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Merch } from '../models/merch.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MerchandiseService {
  private apiUrl = 'http://localhost:3001/api/merchandise';

  constructor(private http: HttpClient) {}

  addMerch(merchData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addMerch`, merchData, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('API error occurred:', error);
    return throwError('An error occurred; please try again.');
  }
  
}
