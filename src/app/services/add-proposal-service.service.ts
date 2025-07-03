import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ServiceRequest } from 'app/models/add-proposal.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddProposalServiceService {
  private apiUrl = `${environment.apiBaseUrl}/DisabledOffer`;

  constructor(private http: HttpClient) { }

  createServiceRequest(requestData: ServiceRequest): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(this.apiUrl, requestData).pipe(
      catchError(this.handleError)
    );
  }

  getServiceCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/ServiceCategory/serviceCategory`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
