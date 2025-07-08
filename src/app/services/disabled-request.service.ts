import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DisabledRequest } from '../models/disabled-request.model';
import { DisabledRequestwithdetails } from 'app/models/disabled-requestwithdetails.model';

@Injectable({ providedIn: 'root' })
export class DisabledRequestService {
  private apiUrl = `${environment.apiBaseUrl}/DisabledRequest`;

  constructor(private http: HttpClient) {}


  createRequest(request: DisabledRequest): Observable<DisabledRequest> {
    return this.http.post<DisabledRequest>(this.apiUrl, request);
  }

getRequestDetailsById(id: number): Observable<DisabledRequestwithdetails> {
  return this.http.get<DisabledRequestwithdetails>(`https://localhost:7037/api/DisabledRequest/details/${id}`);
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
updateRequest(request: any): Observable<any> {
  const token = localStorage.getItem('Token');
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.put(`https://localhost:7037/api/DisabledRequest/${request.id}`, request, { headers });
}

patchStatus(id: number, newStatus: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.patch(
    `${this.apiUrl}/request/status?requestId=${id}&status=${newStatus}`,
    {}, 
    { headers }
  );
}
delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getServiceCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/ServiceCategory/dropdown`);
  }
}

