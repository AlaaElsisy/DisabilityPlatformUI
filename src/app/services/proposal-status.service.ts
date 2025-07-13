import { Injectable } from '@angular/core';
import { HelperRequestService } from './helper-request.service';
import { DisabledOfferService } from './disabled-offer.service';
import { SignalrService } from './signalr.service';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProposalStatusService {
  constructor(
    private helperRequestService: HelperRequestService,
    private disabledOfferService: DisabledOfferService,
    private signalrService: SignalrService
  ) {}

  markCompleted(proposal: any, offerId: number): Observable<any> {
    console.log("skldfnjksdnfjksd,fnjksdnfjkdnfjksdnjkfnjksdnfjksdnf")
    if (!proposal.id || !offerId) return of(null);
    console.log(proposal);
    return this.helperRequestService.updateProposalStatus(proposal.id, 'Completed').pipe(
      switchMap(() =>
        this.disabledOfferService.updateOfferStatus(offerId, 'Completed').pipe(
          switchMap(() => {
            this.signalrService.sendNotificationToClient(
              'Your proposal has been marked as completed!',
              proposal.userId || proposal.helperId?.toString()
            );
            return of({ success: true });
          })
        )
      ),
      catchError(err => {
        return of({ success: false, error: err });
      })
    );
  }

  acceptProposal(proposal: any, offerId: number): Observable<any> {
    if (!proposal.id || !offerId) return of(null);
    return this.helperRequestService.updateProposalStatus(proposal.id, 'Accepted').pipe(
      switchMap(() =>
        this.disabledOfferService.updateOfferStatus(offerId, 'Pending').pipe(
          switchMap(() => {
            this.signalrService.sendNotificationToClient(
              'Your proposal has been accepted!',
              proposal.userId || proposal.helperId?.toString()
            );
            return this.helperRequestService.getProposalsByOfferId(offerId, { pageNumber: 1, pageSize: 1000 }).pipe(
              switchMap(allResponse => {
                const allProposals = allResponse.items || allResponse;
                const rejectCalls = allProposals
                  .filter((p: any) => p.id !== proposal.id && p.status !== 'Rejected' && p.status !== 'Completed')
                  .map((p: any) => this.helperRequestService.updateProposalStatus(p.id, 'Rejected'));
                allProposals
                  .filter((p: any) => p.id !== proposal.id && p.status !== 'Rejected' && p.status !== 'Completed')
                  .forEach((p: any) => {
                    this.signalrService.sendNotificationToClient(
                      'Your proposal was not accepted.',
                      p.userId || p.helperId?.toString()
                    );
                  });
                if (rejectCalls.length > 0) {
                  return Promise.all(rejectCalls.map((obs: any) => obs.toPromise())).then(() => ({ success: true }));
                } else {
                  return of({ success: true });
                }
              })
            );
          })
        )
      ),
      catchError(err => {
        return of({ success: false, error: err });
      })
    );
  }

  cancelProposal(proposal: any, offerId: number): Observable<any> {
    if (!proposal.id || !offerId) return of(null);
    return this.helperRequestService.updateProposalStatus(proposal.id, 'Cancelled').pipe(
      switchMap(() =>
        this.disabledOfferService.updateOfferStatus(offerId, 'Cancelled').pipe(
          switchMap(() => {
            this.signalrService.sendNotificationToClient(
              'Your proposal has been cancelled by the patient.',
              proposal.userId || proposal.helperId?.toString()
            );
            return of({ success: true });
          })
        )
      ),
      catchError(err => {
        return of({ success: false, error: err });
      })
    );
  }
}
