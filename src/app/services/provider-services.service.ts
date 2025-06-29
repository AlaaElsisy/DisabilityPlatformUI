import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProviderService, ProviderServiceQuery, ProviderServicePagedResult } from '../models/provider-service.model';

@Injectable({
  providedIn: 'root',
})
export class ProviderServicesService {
  private apiUrl = `${environment.apiBaseUrl}/HelperService/paged`;

  constructor(private http: HttpClient) {}

  getPagedServices(query: ProviderServiceQuery): Observable<ProviderServicePagedResult> {
    let params = new HttpParams();
    if (query.helperId) params = params.set('HelperId', query.helperId);
    if (query.serviceCategoryId) params = params.set('ServiceCategoryId', query.serviceCategoryId);
    if (query.searchWord) params = params.set('SearchWord', query.searchWord);
    if (query.pageNumber) params = params.set('PageNumber', query.pageNumber);
    if (query.pageSize) params = params.set('PageSize', query.pageSize);
    if (query.minBudget !== undefined && query.minBudget !== null) params = params.set('MinBudget', query.minBudget);
    if (query.maxBudget !== undefined && query.maxBudget !== null) params = params.set('MaxBudget', query.maxBudget);
    if (query.sortBy) params = params.set('SortBy', query.sortBy);
    return this.http.get<ProviderServicePagedResult>(this.apiUrl, { params });
  }
}



