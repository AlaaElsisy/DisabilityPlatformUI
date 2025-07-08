import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperRequestsService {
  
  private readonly _httpClient=inject(HttpClient)
  AddRequestToOffer(data:any):Observable<any>{
      const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this._httpClient.post(`${environment.apiBaseUrl}/HelperRequest/request`,data,{headers})
  }
  private api = `${environment.apiBaseUrl}/HelperRequest`;
  getRequestCardsByHelperId(helperId: number, page = 1, pageSize = 5): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this._httpClient.get<any>(
    `${environment.apiBaseUrl}/HelperRequest/cards?helperId=${helperId}&page=${page}&pageSize=${pageSize}`,
    { headers }
  );
}

  
updateProposal(id: number, data: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this._httpClient.put(`${environment.apiBaseUrl}/HelperRequest/request/${id}`, data, { headers });
}
deleteProposal(id: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this._httpClient.delete(`${environment.apiBaseUrl}/HelperRequest/request/${id}`, { headers });
}

getCategoriesDropdown(): Observable<{ id: number, name: string }[]> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  return this._httpClient.get<{ id: number, name: string }[]>(`${environment.apiBaseUrl}/ServiceCategory/dropdown`, { headers });
}
updateStatus(id: number, newStatus: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this._httpClient.patch(
    `${environment.apiBaseUrl}/HelperRequest/request/status?requestId=${id}&status=${newStatus}`,
    {}, 
    { headers }
  );
}



}

