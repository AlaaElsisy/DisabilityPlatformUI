import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HelperRequestService {
  private apiUrl = `${environment.apiBaseUrl}/HelperRequest/paged`;

  constructor(private http: HttpClient) {}

  getProposalsByOfferId(disabledOfferId: number): Observable<any> {
    const params = new HttpParams().set('disabledOfferId', disabledOfferId.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  updateProposalStatus(requestId: number, status: string): Observable<any> {
    return this.http.patch(`${environment.apiBaseUrl}/HelperRequest/request/status`, null, {
      params: new HttpParams().set('requestId', requestId.toString()).set('status', status)
    });
  }
} 






























