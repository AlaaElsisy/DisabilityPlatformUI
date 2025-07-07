import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProviderOrdersServicesService {

  private readonly _httpClient=inject(HttpClient)
  
  constructor() { }
 
  getServiceOrders(serviceid:number):Observable<any>{
   const token = localStorage.getItem('token');
   const headers = { Authorization: `Bearer ${token}` };
   return this._httpClient.get(`https://localhost:7037/api/DisabledRequest`,{params: { HelperServiceId: serviceid}, headers: headers })
  }
  changeServiceStatus(requestId: number, status: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  const params = {
    requestId: requestId.toString(),
    status: status.toString()
  };

  return this._httpClient.patch(`https://localhost:7037/api/DisabledRequest/request/status`, null, {
    headers,
    params
  });
}
changeHelperServiceStatus(serviceId: number, status: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  const params = {
    requestId: serviceId.toString(),
    status: status.toString()
  };

  return this._httpClient.patch(`https://localhost:7037/api/HelperService/service/status`, null, {
    headers,
    params
  });
}

}
