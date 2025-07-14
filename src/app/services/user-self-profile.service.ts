import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperProfile } from 'app/models/helper-profile.model';
import { PatientProfile } from 'app/models/patient-profile.model';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private baseUrl = `${environment.apiBaseUrl}/UserProfile`;

  constructor(private http: HttpClient) {}

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getProfile(): Observable<PatientProfile | HelperProfile> {
    const userId = this.getUserId();
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

  uploadProfileImage(fileData: FormData): Observable<{ imageUrl: string }> {
    return this.http.post<{ imageUrl: string }>(
      `${this.baseUrl}/upload-image`,
      fileData
    );
  }

  
 updatePatientProfile(data: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/Patient`, data, {
    observe: 'response'
  });
}


  updateHelperProfile(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/Helper`, data);
  }

 

  withdraw(amount: number, bankAccountNumber: string, bankName: string, accountHolderName: string): Observable<any> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => new Error('User ID is missing'));
    }
    return this.http.post(`${environment.apiBaseUrl}/Helper/withdraw`, {
      userId,
      amount,
      bankAccountNumber,
      bankName,
      accountHolderName,
      currency: 'egp'
    });
  }
}
