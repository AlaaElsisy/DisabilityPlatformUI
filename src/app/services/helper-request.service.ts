import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HelperRequestService {
  private apiUrl = `${environment.apiBaseUrl}/HelperRequest/paged`;

  constructor(private http: HttpClient) {}

  getProposalsByOfferId(
    disabledOfferId: number,
    options?: {
      minTotalPrice?: number;
      maxTotalPrice?: number;
      orderBy?: string;
      pageNumber?: number;
      pageSize?: number;
    }
  ): Observable<any> {
    let params = new HttpParams().set('disabledOfferId', disabledOfferId.toString());
    if (options) {
      if (options.minTotalPrice != null) params = params.set('minTotalPrice', options.minTotalPrice.toString());
      if (options.maxTotalPrice != null) params = params.set('maxTotalPrice', options.maxTotalPrice.toString());
      if (options.orderBy) params = params.set('orderBy', options.orderBy);
      if (options.pageNumber != null) params = params.set('pageNumber', options.pageNumber.toString());
      if (options.pageSize != null) params = params.set('pageSize', options.pageSize.toString());
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  updateProposalStatus(requestId: number, status: string): Observable<any> {
    return this.http.patch(`${environment.apiBaseUrl}/HelperRequest/request/status`, null, {
      params: new HttpParams().set('requestId', requestId.toString()).set('status', status)
    });
  }
} 






























