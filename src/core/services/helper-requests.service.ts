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
 
}
