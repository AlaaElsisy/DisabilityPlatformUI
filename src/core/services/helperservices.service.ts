import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HelperservicesService {

  constructor(private _httpclient:HttpClient) { }
  addhelperservice(data:object,header:any):Observable<any>{
   return this._httpclient.post("https://localhost:7037/api/HelperService/service", data,{ headers: header });
  }
  gethelprservices(id:Number,header:any):Observable<any>{
    return this._httpclient.get(`https://localhost:7037/api/HelperService/helper/${id}/services`,{headers: header});
  }
  helperDeleteservice(id:Number,header:any):Observable<any>
  {
    return this._httpclient.delete(`https://localhost:7037/api/HelperService/service/${id}`,{headers: header});
  }

  getServiceById(id: number, headers: any): Observable<any> {
  return this._httpclient.get(`https://localhost:7037/api/HelperService/service/${id}`, { headers });
}

updateService(id: number, data: object, headers: any): Observable<any> {
  return this._httpclient.put(`https://localhost:7037/api/HelperService/service/${id}`, data, { headers });
}
updateStatus(id: number, status: number, headers: any): Observable<any> {
  return this._httpclient.patch(`https://localhost:7037/api/HelperService/service/status?requestId=${id}&status=${status}`, null, { headers });
}
updateRequestStatus(requestId: number, status: string, headers: any): Observable<any> {
  return this._httpclient.patch(
    `https://localhost:7037/api/DisabledRequest/status?requestId=${requestId}&status=${status}`,
    null,
    { headers }
  );
}
 }

  
