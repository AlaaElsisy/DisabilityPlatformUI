import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DisabledOfferService } from '../../app/services/disabled-offer.service';
import { UserProfileService } from '../../app/services/user-profile.service';
import { DisabledOffer } from '../../app/models/disabled-offer.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HelperRequestService } from '../../app/services/helper-request.service';

@Component({
  selector: 'app-patient-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
  serviceCategories: { id: number, name: string }[] = [];
  selectedCategoryId: string = '';
  searchWord: string = '';
  statuses: string[] = [];
  showDeleteModal = false;
  offerIdToDelete: number | null = null;
  showEditModal = false;
  offerIdToEdit: number | null = null;
  editErrorMessage = '';
  editOfferData: DisabledOffer | null = null;
  showDeleteErrorModal = false;
  deleteErrorMessage = '';


  constructor(
    private disabledOfferService: DisabledOfferService,
    private userProfileService: UserProfileService,
    private helperRequestService: HelperRequestService
  ) {}

  ngOnInit(): void {
    this.userProfileService.getDisabledIdForCurrentUser().subscribe(disabledId => {
      this.disabledId = disabledId;
      this.loadOffers();
    });
    this.disabledOfferService.getServiceCategories().subscribe(categories => {
      this.serviceCategories = categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name || cat.categoryName || cat.serviceCategoryName
      }));
    });
    this.disabledOfferService.getOfferStatuses().subscribe(statuses => {
      this.statuses = statuses;
    });
  }

  loadOffers(): void {
    if (this.disabledId) {
      const query: any = {
        disabledId: this.disabledId,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        status: this.statusFilter || undefined,
        serviceCategoryId: this.selectedCategoryId || undefined,
        searchWord: this.searchWord || undefined
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

  canCancel(offer: DisabledOffer): boolean {
    if (!offer.startServiceTime || offer.status !== 'Open') return false;
    const startDate = new Date(offer.startServiceTime);
    const now = new Date();
    return (startDate.getTime() - now.getTime()) > 24 * 60 * 60 * 1000;
  }

  openDeleteModal(offerId: number): void {
    const offer = this.disabledOffers.find(o => o.id === offerId);
    if (offer && !this.canCancel(offer)) {
      this.deleteErrorMessage = 'You cannot Cancel this offer .';
      this.showDeleteErrorModal = true;
      this.offerIdToDelete = null;
      return;
    }
    this.offerIdToDelete = offerId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    console.log('Closing modal');
    this.showDeleteModal = false;
    this.offerIdToDelete = null;
  }

  closeDeleteErrorModal(): void {
    this.showDeleteErrorModal = false;
    this.deleteErrorMessage = '';
  }

  confirmDelete(): void {
    if (this.offerIdToDelete != null) {
      this.disabledOfferService.updateOfferStatus(this.offerIdToDelete, 'Cancelled').subscribe(() => {
        const offer = this.disabledOffers.find(o => o.id === this.offerIdToDelete);
        if (offer) {
          offer.status = 'Cancelled';
        }
        const offerId = this.offerIdToDelete;
        if (typeof offerId === 'number') {
          this.helperRequestService.getProposalsByOfferId(offerId, { pageNumber: 1, pageSize: 1000 }).subscribe(response => {
            if (response.items && response.items.length > 0) {
              response.items.forEach((proposal: any) => {
                this.helperRequestService.updateProposalStatus(proposal.id, 'rejected').subscribe();
              });
            }
          });
        }
        this.closeDeleteModal();
      });
    }
  }

  openEditModal(offer: DisabledOffer): void {
    this.helperRequestService.getProposalsByOfferId(offer.id!, { pageNumber: 1, pageSize: 1 }).subscribe(response => {
      if (response.totalCount > 0) {
        this.editErrorMessage = 'You cannot edit this offer because it already has proposals. Please  create a new one.';
        this.offerIdToEdit = offer.id!;
        this.editOfferData = null;
        this.showEditModal = true;
      } else {
        this.disabledOfferService.getById(offer.id!).subscribe(offerData => {
          this.editErrorMessage = '';
          this.offerIdToEdit = offer.id!;
          this.editOfferData = offerData;
          this.showEditModal = true;
        });
      }
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.offerIdToEdit = null;
    this.editErrorMessage = '';
    this.editOfferData = null;
  }

  isEditDateInvalid(): boolean {
    if (!this.editOfferData?.startServiceTime || !this.editOfferData?.endServiceTime) return false;
    const now = new Date();
    const start = new Date(this.editOfferData.startServiceTime);
    const end = new Date(this.editOfferData.endServiceTime);
    // Both must be strictly in the future, and end > start
    return start <= now || end <= now || end <= start;
  }

  saveEditOffer(): void {
    if (this.editOfferData && this.offerIdToEdit) {
      const now = new Date();
      const start = new Date(this.editOfferData.startServiceTime!);
      const end = new Date(this.editOfferData.endServiceTime!);
      if (start <= now || end <= now) {
        this.editErrorMessage = 'Both start and end date/time must be in the future.';
        return;
      }
      if (end <= start) {
        this.editErrorMessage = 'End date/time must be after start date/time.';
        return;
      }
      this.editErrorMessage = '';
      this.disabledOfferService.updateOffer(this.offerIdToEdit, this.editOfferData).subscribe({
        next: () => {
          this.closeEditModal();
          this.loadOffers();
        },
        error: err => {
          alert('Failed to update offer: ' + (err?.error?.message || err.message || err));
        }
      });
    }
  }

  onEditDateChange(): void {
    this.editErrorMessage = '';
  }

}
