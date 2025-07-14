import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '../../app/models/notification.model';


import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class NotificationService {
  private baseUrl = 'https://localhost:7037/api/Notification';

  constructor(private http: HttpClient) {}

  getNotifications(userId: string, pageNumber:number): Observable<Notification[]> {
    const params = new HttpParams().set('userId', userId)
    .set('pageNumber', pageNumber.toString());

    return this.http.get<Notification[]>(this.baseUrl, { params });
  }
}
