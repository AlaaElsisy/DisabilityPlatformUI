import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperProfile } from 'app/models/helper-profile.model';
import { PatientProfile } from 'app/models/patient-profile.model';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileViewService {
   private baseUrl = `${environment.apiBaseUrl}/UserProfile`;

  constructor(private http: HttpClient) {}
 getProfileFromUrl(userId: string, role: string): Observable<PatientProfile | HelperProfile> {
    if (!userId || !role) {
      return throwError(() => new Error('User ID or Role is missing in URL'));
    }
  
    const lowerRole = role.toLowerCase();

    if (lowerRole === 'patient') {
      return this.http.get<PatientProfile>(`${this.baseUrl}/Patient?userid=${userId}`);
    } else if (lowerRole === 'helper') {
      return this.http.get<HelperProfile>(`${this.baseUrl}/Helper?userid=${userId}`);
    } else {
      return throwError(() => new Error('Unsupported role in URL'));
    }
  }

}

