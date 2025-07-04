import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private apiUrl = `${environment.apiBaseUrl}/disabled/disabled-id`;

  constructor(private http: HttpClient) {}


  getDisabledIdForCurrentUser(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}`);
  }


}
