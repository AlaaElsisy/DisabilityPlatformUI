import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ServiceRequest } from 'app/models/add-proposal.model';

@Injectable({
  providedIn: 'root'
})
export class AddProposalServiceService {
  private apiUrl = 'https://localhost:7037/api/DisabledOffer';

  constructor(private http: HttpClient) { }

  createServiceRequest(requestData: ServiceRequest): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(this.apiUrl, requestData).pipe(
      catchError(this.handleError)
    );
  }

  getServiceCategories(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7037/api/ServiceCategory');
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
