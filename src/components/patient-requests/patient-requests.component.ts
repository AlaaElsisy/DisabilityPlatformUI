import { Component, OnInit } from '@angular/core';
import { DisabledOfferService } from '../../app/services/disabled-offer.service';
import { UserProfileService } from '../../app/services/user-profile.service';
import { DisabledOffer } from '../../app/models/disabled-offer.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-requests.component.html',
  styleUrls: ['./patient-requests.component.css']
})
export class PatientRequestsComponent implements OnInit {
  disabledOffers: DisabledOffer[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 5;
  statusFilter = '';
  disabledId: number | null = null;

  constructor(
    private disabledOfferService: DisabledOfferService,
    private userProfileService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.userProfileService.getDisabledIdForCurrentUser().subscribe(disabledId => {
      this.disabledId = disabledId;
      this.loadOffers();
    });
  }

  loadOffers(): void {
    if (this.disabledId) {
      const query: any = {
        disabledId: this.disabledId,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        status: this.statusFilter || undefined
      };
      this.disabledOfferService.getOffers(query).subscribe(response => {
        this.disabledOffers = response.items;
        this.totalCount = response.totalCount;
      });
    }
  }

  onPageChange(newPage: number): void {
    if (newPage < 1 || (this.pageSize * (newPage - 1)) >= this.totalCount) return;
    this.pageNumber = newPage;
    this.loadOffers();
  }

  onFilterChange(): void {
    this.pageNumber = 1;
    this.loadOffers();
  }

  get totalPages(): number {
    return this.pageSize > 0 ? Math.ceil(this.totalCount / this.pageSize) : 1;
  }
}
