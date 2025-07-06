import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DisabledRequest } from '../models/disabled-request.model';

@Injectable({ providedIn: 'root' })
export class DisabledRequestService {
  private apiUrl = `${environment.apiBaseUrl}/DisabledRequest`;

  constructor(private http: HttpClient) {}


  createRequest(request: DisabledRequest): Observable<DisabledRequest> {
    return this.http.post<DisabledRequest>(this.apiUrl, request);
  }


  getRequestsByDisabledIdPaged(
    disabledId: number,
    page: number,
    pageSize: number,
    status?: string,
    categoryId?: number,
    search?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('disabledId', disabledId.toString())
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString());

    if (status) params = params.set('status', status);
    if (categoryId) params = params.set('categoryId', categoryId.toString());
 if (search) params = params.set('searchWord', search);

    return this.http.get<any>(`${this.apiUrl}`, { params }); 
  }

  
  cancelRequest(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getServiceCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/ServiceCategory/dropdown`);
  }
}

