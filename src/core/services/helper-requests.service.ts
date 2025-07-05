import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperRequestsService {
  
  private readonly _httpClient=inject(HttpClient)
  AddRequestToOffer(data:any):Observable<any>{
      const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this._httpClient.post(`https://localhost:7037/api/HelperRequest/request`,data,{headers})
  }
  private api = 'https://localhost:7037/api/HelperRequest';
  getRequestCardsByHelperId(helperId: number, page = 1, pageSize = 5): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this._httpClient.get<any>(
    `https://localhost:7037/api/HelperRequest/cards?helperId=${helperId}&page=${page}&pageSize=${pageSize}`,
    { headers }
  );
}

  
updateProposal(id: number, data: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this._httpClient.put(`https://localhost:7037/api/HelperRequest/request/${id}`, data, { headers });
}
deleteProposal(id: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this._httpClient.delete(`https://localhost:7037/api/HelperRequest/request/${id}`, { headers });
}



}

