import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

export interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class ServiceCategoryService {
  private apiUrl = `${environment.apiBaseUrl}/ServiceCategory/serviceCategory`;

  constructor(private http: HttpClient) {}

  getServiceCategories(): Observable<ServiceCategory[]> {
    return this.http.get<ServiceCategory[]>(this.apiUrl).pipe(
      map(categories => categories.map(cat => ({
        ...cat,
        image: cat.image ? `${environment.ImagesBaseUrl}/${cat.image.replace(/ /g, '%20')}` : ''
      })))
    );
  }
} 