import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelperRequestService } from '../../app/services/helper-request.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DisabledOfferService } from '../../app/services/disabled-offer.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SignalrService } from '../../app/services/signalr.service';
import { ProposalStatusService } from '../../app/services/proposal-status.service';

@Component({
  selector: 'app-patient-offer-proposals',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './patient-offer-proposals.component.html',
  styleUrl: './patient-offer-proposals.component.css'
})
export class PatientOfferProposalsComponent implements OnInit, OnChanges {
  @Input() offerId?: number;
  proposals: any[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 5;
  minTotalPrice?: number;
  maxTotalPrice?: number;
  orderBy: string = '';
  offerStartServiceTime?: string;

  confirmAction: 'accept' | 'completed' | 'cancel' | null = null;
  confirmIndex: number | null = null;

  constructor(
    private helperRequestService: HelperRequestService,
    private route: ActivatedRoute,
    private disabledOfferService: DisabledOfferService,
    private router: Router,
    private signalrService: SignalrService,
    private proposalStatusService: ProposalStatusService
  ) {}

  ngOnInit(): void {
    if (this.offerId == null) {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.offerId = +id;
          this.fetchOfferStartTime();
          this.fetchProposalsWithMarkCompletedCheck();
        }
      });
    } else {
      this.fetchOfferStartTime();
      this.fetchProposalsWithMarkCompletedCheck();
    }
  }

  ngOnChanges() {
    if (this.offerId) {
      this.fetchOfferStartTime();
      this.fetchProposals();
    }
  }

  private fetchProposalsWithMarkCompletedCheck() {
    this.fetchProposals(() => {
      const nav = window.history.state;
      if (nav && nav.markCompleted && nav.helperRequestId) {
        setTimeout(() => {
          const proposal = this.proposals.find(p => p.id === nav.helperRequestId);
          if (proposal) {
            this.markCompleted(proposal);
          }
        }, 0);
      }
    });
  }

  private fetchProposals(callback?: () => void) {
    if (this.offerId) {
      this.helperRequestService.getProposalsByOfferId(this.offerId, {
        minTotalPrice: this.minTotalPrice,
        maxTotalPrice: this.maxTotalPrice,
        orderBy: this.orderBy,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
     }).subscribe(response => {
        const proposals = response.items || response;
    
        this.proposals = proposals.sort((a: any, b: any) => {
          if (a.status === 'Rejected' && b.status !== 'Rejected') return 1;
          if (a.status !== 'Rejected' && b.status === 'Rejected') return -1;
          return 0;
        });
        this.totalCount = response.totalCount || (response.items ? response.items.length : 0);
        if (callback) callback();
      });
    } 
  }

  onFilterChange() {
    this.pageNumber = 1;
    this.fetchProposals();
  }

  onPageChange(newPage: number) {
    if (newPage < 1 || (this.pageSize * (newPage - 1)) >= this.totalCount) return;
    this.pageNumber = newPage;
    this.fetchProposals();
  }

  get totalPages(): number {
    return this.pageSize > 0 ? Math.ceil(this.totalCount / this.pageSize) : 1;
  }

  acceptProposal(proposal: any) {
    if (!proposal.id || !this.offerId) return;
    this.proposalStatusService.acceptProposal(proposal, this.offerId).subscribe({
      next: () => this.fetchProposals(),
      error: err => alert('Failed to accept proposal: ' + (err?.error?.message || err.message || err))
    });
  }

  markCompleted(proposal: any) {
    if (!proposal.id || !this.offerId) return;
    this.proposalStatusService.markCompleted(proposal, this.offerId).subscribe({
      next: () => this.fetchProposals(),
      error: err => alert('Failed to mark as completed: ' + (err?.error?.message || err.message || err))
    });
  }

  private fetchOfferStartTime() {
    if (this.offerId) {
      this.disabledOfferService.getById(this.offerId).subscribe(offer => {
        this.offerStartServiceTime = offer.startServiceTime;
      });
    }
  }

  canCancel(): boolean {
    if (!this.offerStartServiceTime) return false;
    const start = new Date(this.offerStartServiceTime).getTime();
    const now = Date.now();
    return start - now > 24 * 60 * 60 * 1000;
  }

  requestCancellation(proposal: any) {
    if (!proposal.id || !this.offerId) return;
    if (!this.canCancel()) {
      alert('You can only request cancellation at least 24 hours before the start date of the offer.');
      return;
    }
    this.proposalStatusService.cancelProposal(proposal, this.offerId).subscribe({
      next: () => this.fetchProposals(),
      error: err => alert('Failed to request cancellation: ' + (err?.error?.message || err.message || err))
    });
  }

  showConfirm(action: 'accept' | 'completed' | 'cancel', index: number) {
    this.confirmAction = action;
    this.confirmIndex = index;
  }

  closeConfirm() {
    this.confirmAction = null;
    this.confirmIndex = null;
  }

  confirmActionHandler(proposal: any) {
    if (this.confirmAction === 'accept') {
      this.acceptProposal(proposal);
    } else if (this.confirmAction === 'completed') {
      this.markCompleted(proposal);
    } else if (this.confirmAction === 'cancel') {
      this.requestCancellation(proposal);
    }
    this.closeConfirm();
  }

  editProposal(index: number): void {
  }

  deleteProposal(index: number): void {
  } 

  goToPayment(proposal: any) {
    this.router.navigate(['/provider-request-payment'], {
      state: {
        amount: proposal.totalPrice,
        helperRequestId: proposal.id,
        offerId: this.offerId,
      }
    });
  }
} 