import { Component, OnInit } from '@angular/core';
import { DisabledRequestService } from 'app/services/disabled-request.service';
import { DisabledRequest } from 'app/models/disabled-request.model';
import { UserProfileService } from 'app/services/user-profile.service';
import { ServiceCategory } from 'app/models/service-category.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './service-Requests.component.html',
  styleUrls: ['./service-Requests.component.css']
})
export class ServiceRequestsComponent implements OnInit {
  disabledRequests: DisabledRequest[] = [];
  statuses = ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'];
  serviceCategories: ServiceCategory[] = [];
  searchWord = '';
  statusFilter = '';
selectedCategoryId: number | null = null;
  pageNumber = 1;
  pageSize = 5;
  totalCount = 0;
  totalPages = 1;
  showDeleteModal = false;
  selectedRequestIdToDelete: number | null = null;
  disabledId: number | null = null;


  constructor(private requestService: DisabledRequestService, private userProfileService: UserProfileService) {}

  ngOnInit() {
   this.userProfileService.getDisabledIdForCurrentUser().subscribe(disabledId => {
  this.disabledId = disabledId;
  this.fetchRequests();
     this.requestService.getServiceCategories().subscribe(categories => {
      this.serviceCategories = categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name || cat.categoryName || cat.serviceCategoryName
      }));
    });
});

   
  }

fetchRequests() {
  if (!this.disabledId) return;

  this.requestService
    .getRequestsByDisabledIdPaged(
      this.disabledId,
      this.pageNumber,
      this.pageSize,
      this.statusFilter || undefined,
      this.selectedCategoryId != null ? this.selectedCategoryId : undefined,
      this.searchWord || undefined
    )
    .subscribe(res => {
      this.disabledRequests = res.items;
      this.totalCount = res.totalCount;
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    });
}

  onFilterChange() {
    this.pageNumber = 1;
    this.fetchRequests(); 
  }

  onPageChange(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.pageNumber = newPage;
    this.fetchRequests();
  }
  viewDetails(id: number) {
  window.open(`/request-details/${id}`, '_blank');
}

openDeleteModal(id: number) {
  this.selectedRequestIdToDelete = id;
  this.showDeleteModal = true;
  document.body.style.overflow = 'hidden';
}

closeDeleteModal() {
  this.selectedRequestIdToDelete = null;
  this.showDeleteModal = false;
  document.body.style.overflow = '';
}

confirmDelete(): void {
  if (this.selectedRequestIdToDelete != null) {
    this.requestService.delete(this.selectedRequestIdToDelete).subscribe({
      next: () => {
        if ((this.totalCount - 1) <= (this.pageNumber - 1) * this.pageSize && this.pageNumber > 1) {
          this.pageNumber--;
        }
        this.fetchRequests();
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error("Delete failed:", err);
      }
    });
  }
}
handleOutsideClick(event: MouseEvent) {
  const dialog = document.querySelector('.modal-dialog');
  if (dialog && !dialog.contains(event.target as Node)) {
    this.closeDeleteModal();
  }
}

}
