import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ServiceRequest } from 'app/models/add-proposal.model';


@Injectable({
  providedIn: 'root'
})
export class AddProposalServiceService {
   private apiUrl = '/api/service-requests';

  constructor(private http: HttpClient) { }

  createServiceRequest(requestData: ServiceRequest): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(this.apiUrl, requestData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
