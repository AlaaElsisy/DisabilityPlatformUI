import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

export interface WithdrawalPaymentData {
  amount: number;
  bankAccountNumber: string;
  bankName: string;
  accountHolderName: string;
  currency?: string;
  UserId?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class WithdrawalPaymentService {
  private baseUrl = `${environment.apiBaseUrl}/Helper`;

  constructor(private http: HttpClient) {}

  processWithdrawal(withdrawalData: WithdrawalPaymentData): Observable<any> {
    const requestData = {
      ...withdrawalData,
      UserId: localStorage.getItem('userId') 
    };
    return this.http.post(`${this.baseUrl}/withdraw`, requestData);
  }

  getHelperBalance(): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.get(`${environment.apiBaseUrl}/UserProfile/Helper?userid=${userId}`);
  }
} 