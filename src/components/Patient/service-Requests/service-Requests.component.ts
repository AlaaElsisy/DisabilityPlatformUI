import { Component, OnInit } from '@angular/core';
import { DisabledRequestService } from 'app/services/disabled-request.service';
import { DisabledRequest } from 'app/models/disabled-request.model';
import { UserProfileService } from 'app/services/user-profile.service';
import { ServiceCategory } from 'app/models/service-category.model';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentDataService } from 'app/services/payment/payment-data.service'; 
import { DisabledRequestwithdetails } from 'app/models/disabled-requestwithdetails.model'; 
import { GetloggineduserDataService } from 'core/services/getloggineduser-data.service';
import { SignalrService } from 'app/services/signalr.service'; 
import { ToastrService } from 'ngx-toastr';

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
showCompleteModal = false;
selectedRequestToComplete: any = null;
dateError: string | null = null;



  constructor(private requestService: DisabledRequestService, private userProfileService: UserProfileService,private router: Router,private paymentDataService: PaymentDataService, private signalrService: SignalrService,  private getloggineduserDataService: GetloggineduserDataService, private _toster: ToastrService) {}

 ngOnInit() {
   this.getloggineduserDataService.getuserData().subscribe(userId => {
    this.signalrService.startConnection(userId);
  });
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
document.body.classList.add('modal-open');
}

closeDeleteModal() {
  this.selectedRequestIdToDelete = null;
  this.showDeleteModal = false;
document.body.classList.remove('modal-open');
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
document.body.classList.add('modal-open');
      },
      error: (err) => {
        console.error('Failed to load details:', err);
      }
    });
  }

  closeDetailsModal() {
    this.selectedRequestDetails = null;
    this.showDetailsModal = false;
document.body.classList.remove('modal-open');

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

  const startDate = new Date(this.selectedRequestToEdit.start);
  const endDate = new Date(this.selectedRequestToEdit.end);

  if (endDate < startDate) {
    this.dateError = 'End date must be after start date.';
    return;
  } else {
    this.dateError = null;
  }

  const updatedRequest = {
    id: this.selectedRequestToEdit.id,
    description: this.selectedRequestToEdit.description?.trim(),
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    price: this.selectedRequestToEdit.price ?? 0,
    disabledId: this.selectedRequestToEdit.disabledId,
    requestDate: new Date(this.selectedRequestToEdit.requestDate).toISOString(),
    status: this.selectedRequestToEdit.status,
    helperServiceId: this.selectedRequestToEdit.helperServiceId ?? 1
  };

  this.requestService.updateRequest(updatedRequest).subscribe({
    next: () => {
      this._toster.success('Request updated successfully!', 'Update Successful', {
        positionClass: 'toast-top-center'
      });
      this.fetchRequests();
      this.closeEditModal();
    },
    error: (err) => {
      this._toster.error('Error updating request. Please try again.', 'Update Failed', {
        positionClass: 'toast-top-center'
      });
    }
  });
}


closeEditModal() {
  this.selectedRequestToEdit = null;
  this.showEditModal = false;
document.body.classList.remove('modal-open');
}
canEdit(request: any): boolean {
  return request.status === 'Pending';
}

canDelete(request: any): boolean {
  return request.status === 'Pending';
}

openCancelModal(request: any) {
  this.selectedRequestToCancel = request;
  this.showCancelModal = true;
document.body.classList.add('modal-open');
}

closeCancelModal() {
  this.selectedRequestToCancel = null;
  this.showCancelModal = false;
document.body.classList.remove('modal-open');
}

confirmCancelRequest(request: any) {
  this.requestService.getRequestDetailsById(request.id).subscribe({
    next: (details) => {
      const helperUserId = details.helperUserId;

      if (!helperUserId) {
        console.error('Helper user ID is missing in request details.');
        return;
      }

      const message = `The request for "${details.serviceDescription}" has been cancelled by ${details.patientName}.`;

      if (this.signalrService.isConnected()) {
        this.signalrService.sendNotificationToClient(message, helperUserId)
          .then(() => console.log("Notification sent to helper"))
          .catch(err => console.error("Failed to send notification", err));
      } else {
        console.warn("SignalR is not connected yet");
      }

      this.requestService.patchStatus(request.id, 'Cancelled').subscribe({
        next: () => {
          this.fetchRequests();
          this.closeCancelModal(); 
        },
        error: (err) => {
          console.error('Failed to cancel request:', err);
        }
      });
    },
    error: (err) => {
      console.error("Error getting request details:", err);
    }
  });
}


openCompleteModal(request: any) {
  this.selectedRequestToComplete = request;
  this.showCompleteModal = true;
document.body.classList.add('modal-open');
}
confirmCompleteRequest(request: DisabledRequest | null | undefined) {
  if (!request || !request.id) {
    console.error("Invalid request object or missing ID");
    return;
  }

  this.requestService.getRequestDetailsById(request.id).subscribe({
    next: (details) => {
    this.paymentDataService.setData({
  patientName: details.patientName || 'N/A',
  helperName: details.helperName || 'N/A',
  serviceName: details.serviceDescription || 'N/A',
  amount: details.price || 0,
  disabledRequestId: details.id
});

this.router.navigate(['/payment']);

    }
  });
}

gotoPatientProfile(userId: string): void {
  console.log(userId);
  this.router.navigate(['/user-view-profile'], {
    queryParams: { userId, role: 'helper' }
  });
}




closeCompleteModal() {
  this.selectedRequestToComplete = null;
  this.showCompleteModal = false;
document.body.classList.remove('modal-open');
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
       // alert("Request cancelled successfully.");
        this._toster.success('Request cancelled successfully.', 'Cancellation Successful', {
          positionClass: 'toast-top-center'
        });
        this.fetchRequests();
      },
      error: (err) => {
        console.error('Failed to cancel request:', err);
        //alert("Cancel failed.");
        this._toster.error('Cancel failed.', 'Cancellation Failed', {
          positionClass: 'toast-top-center'
        });
      }
    });
  }
}
canComplete(request: any): boolean {
  return request.status === 'Accepted';
}
markAsComplete(request: any) {
  if (confirm("Are you sure you want to mark this request as completed?")) {
    this.requestService.patchStatus(request.id, 'Completed').subscribe({
      next: () => {
       // alert("Request marked as completed.");
        this._toster.success('Request marked as completed.', 'Completion Successful', {
          positionClass: 'toast-top-center'
        });
        this.fetchRequests();
      },
      error: (err) => {
        console.error('Failed to complete request:', err);
      //  alert("Failed to mark request as completed.");
        this._toster.error('Failed to mark request as completed.', 'Completion Failed', {
          positionClass: 'toast-top-center'
        });
      }
    });
  }
}

showBlockedDeleteModal() {
 // alert("You can't delete this request unless it's Pending or Rejected.");
  this._toster.error("You can't delete this request unless it's Pending or Rejected.", 'Delete Blocked', {
    positionClass: 'toast-top-center'
  });
}

}