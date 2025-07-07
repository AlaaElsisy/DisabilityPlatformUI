import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileViewService {
   private baseUrl = `${environment.apiBaseUrl}/UserProfile`;

  constructor(private http: HttpClient) {}


  // getCurrentPatientProfile(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/patient`);
  // }

  // getCurrentHelperProfile(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/helper`);
  // }

getUserRoleFromToken(): string | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload['role'] || null;
}

  getUserProfileById(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/userById/${userId}`);
  }
}

