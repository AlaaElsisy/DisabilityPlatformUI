import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://localhost:44346/api/Authentication';

  constructor(private http: HttpClient) {}

  register(formData: any): Observable<any> {
    console.log("aHMED");
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
      isDisabled: formData.role.toLowerCase() === 'patient',
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
  const url = `${this.baseUrl}/login`;
  return this.http.post(url, credentials);
}

}
