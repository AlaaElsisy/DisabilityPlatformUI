import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperoffersService {

  private readonly _httpclient=inject(HttpClient);
  GetAlloffrers():Observable<any>{
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this._httpclient.get("https://localhost:7037/api/DisabledOffer",{headers} );
    
  }
  constructor() { }
}
