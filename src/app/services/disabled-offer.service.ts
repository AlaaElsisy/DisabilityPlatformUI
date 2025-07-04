import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DisabledOffer } from '../models/disabled-offer.model';

@Injectable({ providedIn: 'root' })
export class DisabledOfferService {
  private apiUrl = `${environment.apiBaseUrl}/DisabledOffer`;
  private categoriesUrl = `${environment.apiBaseUrl}/ServiceCategory/dropdown`;

  constructor(private http: HttpClient) {}

  getOffers(query: any): Observable<{ items: DisabledOffer[], totalCount: number }> {
    let params = new HttpParams();
    Object.keys(query).forEach(key => {
      if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
        params = params.set(key, query[key]);
      }
    });
    return this.http.get<{ items: DisabledOffer[], totalCount: number }>(this.apiUrl, { params });
  }

  getServiceCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.categoriesUrl);
  }

  getOfferStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/statuses`);
  }

  deleteOffer(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateOfferStatus(offerId: number, status: string) {
    console.log(offerId);
    console.log(status);
    console.log("Magda Elromy");
    return this.http.patch(`${this.apiUrl}/request/status`, null, {
      params: new HttpParams().set('offerId', offerId.toString()).set('status', status)
    });
  }

  getById(id: number): Observable<DisabledOffer> {
    return this.http.get<DisabledOffer>(`${this.apiUrl}/${id}`);
  }

  updateOffer(id: number, offer: DisabledOffer) {
    return this.http.put(`${this.apiUrl}/${id}`, offer);
  }
} 