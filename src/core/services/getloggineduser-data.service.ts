import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetloggineduserDataService {
  private readonly _httpclient=inject(HttpClient)
  constructor() { }
  getuserData():Observable<any>{    
     const token=localStorage.getItem('token')
      const headers = { Authorization: `${token}` };
      return this._httpclient.get("https://localhost:7037/api/UserProfile/helper", { headers });
  }
}