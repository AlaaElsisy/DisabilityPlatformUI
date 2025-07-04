import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetloggineduserDataService {
  token: string | null = localStorage.getItem('token');
  userId:number | null = null;
  private readonly _httpclient = inject(HttpClient);
  constructor() { }
  getuserData():Observable<any>{
    if (this.token) {
      const headers = { Authorization: `${this.token}` };
      return this._httpclient.get("https://localhost:7037/api/UserProfile/helper", { headers });
    } else {
      throw new Error('Token not found in localStorage');
    }
  }
}
