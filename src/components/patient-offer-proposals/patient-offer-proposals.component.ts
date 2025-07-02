import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelperRequestService } from '../../app/services/helper-request.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-offer-proposals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-offer-proposals.component.html',
  styleUrl: './patient-offer-proposals.component.css'
})
export class PatientOfferProposalsComponent implements OnInit, OnChanges {
  @Input() offerId?: number;
  proposals: any[] = [];

  constructor(
    private helperRequestService: HelperRequestService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.offerId == null) {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.offerId = +id;
          this.fetchProposals();
        }
      });
    } else {
      this.fetchProposals();
    }
  }

  ngOnChanges() {
    if (this.offerId) {
      this.fetchProposals();
    }
  }

  private fetchProposals() {
    if (this.offerId) {
      this.helperRequestService.getProposalsByOfferId(this.offerId).subscribe(response => {
        this.proposals = response.items || response;
      });
    }
  }

  changeProposalStatus(proposal: any, newStatus: string) {
    if (!proposal.id) return;
    this.helperRequestService.updateProposalStatus(proposal.id, newStatus).subscribe({
      next: () => this.fetchProposals(),
      error: err => alert('Failed to update status: ' + (err?.error?.message || err.message || err))
    });
  }
} 