import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HelperProfile } from 'app/models/helper-profile.model';
import { PatientProfile } from 'app/models/patient-profile.model';
import { environment } from 'environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private baseUrl = `${environment.apiBaseUrl}/UserProfile`;

  constructor(private http: HttpClient) {}

  getUserId(): string | null {
    console.log('getUserId called', localStorage.getItem('userId'));

    return localStorage.getItem('userId');
  }

  getRole(): string | null {
    console.log('getRole called');

    return localStorage.getItem('role');
  }

  getProfile(): Observable<PatientProfile | HelperProfile> {
    const userId = this.getUserId();
    console.log('getProfile called with userId:', userId);
    const role = this.getRole();

    if (!userId || !role) {
      return throwError(() => new Error('User ID or Role is missing'));
    }

    if (role.toLowerCase() === 'patient') {
      return this.http.get<PatientProfile>(`${this.baseUrl}/Patient?userid=${userId}`);
    } else if (role.toLowerCase() === 'helper') {
      return this.http.get<HelperProfile>(`${this.baseUrl}/Helper?userid=${userId}`);
    } else {
      return throwError(() => new Error('Unsupported role'));
    }
  }
}
