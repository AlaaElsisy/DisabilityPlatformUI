import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HelperProfile } from 'app/models/helper-profile.model';
import { PatientProfile } from 'app/models/patient-profile.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

   private baseUrl = 'https://localhost:7037/api/UserProfile';

  constructor(private http: HttpClient) {}

  getDisabledProfile(): Observable<PatientProfile> {
    return this.http.get<PatientProfile>(`${this.baseUrl}/Disabled`);
  }

  getHelperProfile(): Observable<HelperProfile> {
    return this.http.get<HelperProfile>(`${this.baseUrl}/Helper`);
  }
}
