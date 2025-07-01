import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = `${environment.apiBaseUrl}/Authentication/register`;

  constructor(private http: HttpClient) {}

  register(formData: any): Observable<any> {
    const role = formData.role;
    const params = new HttpParams().set('role', role);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phone: formData.phoneNumber,
      region: formData.region,
      address: formData.address,
      birthday: formData.dateOfBirth,
      gender: formData.gender,
      isDisabled: role.toLowerCase() === 'patient',
      description: 'From Angular',
      desabilityType: formData.disabilityType,
      medicalCondition: formData.medicalConditionDescription,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactPhone: formData.emergencyContactPhone,
      emergencyContactRelation: formData.emergencyContactRelation
    };

    console.log('Register() called');
    console.log('Payload:', payload);
    console.log('🔧 Params:', params.toString());

    return this.http.post(this.baseUrl, payload, { params }).pipe(
      tap(response => {
        console.log('Register response:', response);
      }),
      catchError(error => {
        console.error('Register error:', error);
        return throwError(() => error);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    const url = "https://localhost:7037/api/Authentication/login";
    console.log('Login called with:', credentials);

    return this.http.post(url, credentials).pipe(
      tap(res => console.log('Login response:', res)),
      catchError(err => {
        console.error('Login error:', err);
        return throwError(() => err);
      })
    );
  }
}
