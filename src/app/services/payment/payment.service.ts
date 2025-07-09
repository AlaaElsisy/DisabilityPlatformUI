import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

   

   private baseUrl = `${environment.apiBaseUrl}/Payment`;

  constructor(private http: HttpClient) {}

  chargeCard(paymentData: any) {
    console.log(paymentData)
    return this.http.post(`${this.baseUrl}/charge`, paymentData);
  }
  
patchRequestStatus(id: number, newStatus: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.patch(
    `https://localhost:7037/api/DisabledRequest/request/status?requestId=${id}&status=${newStatus}`,
    {}, 
    { headers }
  );
}
  //   createPayment(payload: { helperRequestId?: number|null; disabledRequestId?: number|null }) {
  //   return this.http.post<{ sessionUrl: string }>(`${this.baseUrl}/create`, payload);
  // }

  // confirmPayment(sessionId: string) {
  //   return this.http.get<any>(`${this.baseUrl}/success?sessionId=${sessionId}`);
  // }
}
