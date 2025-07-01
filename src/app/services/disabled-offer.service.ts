import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DisabledOffer } from '../models/disabled-offer.model';

@Injectable({ providedIn: 'root' })
export class DisabledOfferService {
  private apiUrl = `${environment.apiBaseUrl}/DisabledOffer`;

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
} 