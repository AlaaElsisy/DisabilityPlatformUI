import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetofferbyidService {
 private readonly _httpclient=inject(HttpClient);
 getofferById(id: number, headers: any): Observable<any> {
    return this._httpclient.get(`https://localhost:7037/api/DisabledOffer/${id}`, { headers });
  }
  getOfferRequests(offerId: number, headers: any): Observable<any> {
    
    return this._httpclient.get(`https://localhost:7037/api/HelperRequest/paged`,{params: { DisabledOfferId: offerId}, headers: headers });
  }
  constructor() { }
}
