import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://localhost:7037/api/Authentication/register';

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

    return this.http.post(this.baseUrl, payload, { params });
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    const url = `https://localhost:7037/api/Authentication/login`;
    return this.http.post(url, credentials);
  }
}
