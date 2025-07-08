import { Component, OnInit } from '@angular/core';
import { DisabledRequestService } from 'app/services/disabled-request.service';
import { DisabledRequest } from 'app/models/disabled-request.model';
import { UserProfileService } from 'app/services/user-profile.service';
import { ServiceCategory } from 'app/models/service-category.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DisabledRequestwithdetails } from 'app/models/disabled-requestwithdetails.model'; 

@Component({
  selector: 'app-service-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './service-Requests.component.html',
  styleUrls: ['./service-Requests.component.css']
})
export class ServiceRequestsComponent implements OnInit {
  // serviceRequests: DisabledRequest[] = [];
  statuses = [    'Pending',
  'Accepted',
  'Cancelled',
  'Completed'];
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
selectedRequestToEdit: any = null;
showEditModal: boolean = false;
showCancelModal: boolean = false;
selectedRequestToCancel: any = null;
serviceRequests: DisabledRequestwithdetails[] = []; 
selectedRequestDetails: DisabledRequestwithdetails | null = null;
showDetailsModal: boolean = false;


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
  }
  );
  } 
fetchRequests() {
  if (!this.disabledId) return;

  this.requestService
    .getRequestsByDisabledIdPaged(
      this.disabledId,
      this.pageNumber,
      this.pageSize,
this.statusFilter?.trim() === '' ? undefined : this.statusFilter,
      this.selectedCategoryId != null ? this.selectedCategoryId : undefined,
      this.searchWord || undefined,
    
      
    )
    .subscribe(res => {
      this.serviceRequests = res.items;
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
  window.open(`/request-details/${id}`);
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
  openDetailsModal(id: number) {
    this.requestService.getRequestDetailsById(id).subscribe({
      next: (details) => {
        this.selectedRequestDetails = details;
        this.showDetailsModal = true;
        document.body.style.overflow = 'hidden';
      },
      error: (err) => {
        console.error('Failed to load details:', err);
      }
    });
  }

  closeDetailsModal() {
    this.selectedRequestDetails = null;
    this.showDetailsModal = false;
    document.body.style.overflow = '';

  }
openEditModal(request: any): void {
  this.selectedRequestToEdit = JSON.parse(JSON.stringify(request));
 console.log('Request to edit:', this.selectedRequestToEdit);
  if (this.selectedRequestToEdit.start) {
    const startDate = new Date(this.selectedRequestToEdit.start);
    this.selectedRequestToEdit.start = new Date(this.selectedRequestToEdit.start).toISOString();


  }
  
  if (this.selectedRequestToEdit.end) {
    const endDate = new Date(this.selectedRequestToEdit.end);
this.selectedRequestToEdit.end = new Date(this.selectedRequestToEdit.end).toISOString();  }
  
  this.showEditModal = true;
  console.log('Request to edit:', this.selectedRequestToEdit);
}
submitEdit() {
  if (!this.selectedRequestToEdit) {
    console.error('No request selected for edit');
    return;
  }
  if (!this.selectedRequestToEdit.description || 
      !this.selectedRequestToEdit.start || 
      !this.selectedRequestToEdit.end) {
    alert('Please fill all required fields');
    return;
  }

const updatedRequest = {
  id: this.selectedRequestToEdit.id,
  description: this.selectedRequestToEdit.description?.trim(),
  start: new Date(this.selectedRequestToEdit.start).toISOString(),
  end: new Date(this.selectedRequestToEdit.end).toISOString(),
  price: this.selectedRequestToEdit.price ?? 0,
  disabledId: this.selectedRequestToEdit.disabledId,
  requestDate: new Date(this.selectedRequestToEdit.requestDate).toISOString() ,
  status: this.selectedRequestToEdit.status,
  helperServiceId: this.selectedRequestToEdit.helperServiceId ?? 1
};



  console.log('Submitting:', updatedRequest);
console.log(JSON.stringify(updatedRequest, null, 2));

  this.requestService.updateRequest(updatedRequest).subscribe({
    next: () => {
     // alert('Request updated successfully!');
      this.fetchRequests();
      this.closeEditModal();
    },
    error: (err) => {
      console.error("Update failed:", err);
     // alert('Error updating request. Please try again.');
    }
  });
}

closeEditModal() {
  this.selectedRequestToEdit = null;
  this.showEditModal = false;
  document.body.style.overflow = '';
}
canEdit(request: any): boolean {
  return request.status === 'Pending';
}

canDelete(request: any): boolean {
  return request.status === 'Pending' || request.status === 'Rejected';
}

openCancelModal(request: any) {
  this.selectedRequestToCancel = request;
  this.showCancelModal = true;
  document.body.style.overflow = 'hidden';
}

closeCancelModal() {
  this.selectedRequestToCancel = null;
  this.showCancelModal = false;
  document.body.style.overflow = '';
}

confirmCancelRequest() {
  if (!this.selectedRequestToCancel) return;

  this.requestService.patchStatus(this.selectedRequestToCancel.id, 'Cancelled').subscribe({
    next: () => {
      this.fetchRequests();
      this.closeCancelModal();
    },
    error: (err) => {
      console.error('Failed to cancel request:', err);
      this.closeCancelModal();
    }
  });
}

canCancel(request: any): boolean {
  if (request.status !== 'Accepted') return false;
  const now = new Date();
  const startDate = new Date(request.start);
  const diffHours = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  return diffHours >= 24;
}
cancelRequest(request: any) {
  if (confirm("Are you sure you want to cancel this request?")) {
    this.requestService.patchStatus(request.id, 'Cancelled').subscribe({
      next: () => {
        alert("Request cancelled successfully.");
        this.fetchRequests();
      },
      error: (err) => {
        console.error('Failed to cancel request:', err);
        alert("Cancel failed.");
      }
    });
  }
}
showBlockedDeleteModal() {
  alert("You can't delete this request unless it's Pending or Rejected.");
}

}