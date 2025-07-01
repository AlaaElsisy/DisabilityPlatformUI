import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getRequestsByDisabledId(disabledId: number): Observable<DisabledRequest[]> {
    return this.http.get<DisabledRequest[]>(`${this.apiUrl}?disabledId=${disabledId}`);
  }
} 