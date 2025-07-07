import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HelperRequestsService } from 'core/services/helper-requests.service';
import { GetloggineduserDataService } from 'core/services/getloggineduser-data.service';
import { FormsModule } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-helper-proposals',
   standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './providerrequests.component.html',
   styleUrls: ['./providerrequests.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProviderRequestsComponent {
allProposals: any[] = []; 
helperProposals: any[] = []; 

  
  helperRequestsService = inject(HelperRequestsService);
  userDataService = inject(GetloggineduserDataService);
currentPage = 1;
pageSize = 5;
totalItems = 0;
selectedCategoryId: string = '';
searchWord: string = '';
statuses: string[] = ['Pending','Accepted','Rejected','Completed','Cancelled'];
categories: { id: number, name: string }[] = [];
selectedCategory: string = '';
showViewModal = false;
selectedProposal: any = null;
editableProposal: any = {}; 
isEditing = false;
showDeleteModal = false;
requestIdToDelete: number | null = null;
statusFilter: string = '';
categoryFilter: string = '';

ngOnInit() {
  this.userDataService.getuserData().subscribe({
    next: (userData) => {
      const helperId = userData.id;
      this.loadPagedProposals(helperId);
    },
    error: (err) => console.error('Error fetching helper data:', err)
  });

  this.helperRequestsService.getCategoriesDropdown().subscribe({
    next: (res) => {
      this.categories = res; 
    },
    error: (err) => {
      console.error('Error fetching categories:', err);
    }
  });
}


onFilterChange() {
  this.currentPage = 1;
  this.userDataService.getuserData().subscribe({
    next: (userData) => {
      this.loadPagedProposals(userData.id);
    }
  });
}

viewProposalDetails(requestId: number) {
  const proposal = this.helperProposals.find(p => p.id === requestId);
  if (proposal) {
    this.selectedProposal = proposal;
    this.editableProposal = { ...proposal }; 
    this.isEditing = false;
    this.showViewModal = true;
  }
}

editProposal() {
  this.isEditing = true;
}

saveProposal() {
  const updateData = {
  id: this.editableProposal.id,
  message: this.editableProposal.message,
  totalPrice: this.editableProposal.totalPrice,
  applicationDate: this.editableProposal.applicationDate,
  status: this.editableProposal.status,
  helperId: this.editableProposal.helperId,
  disabledOfferId: this.editableProposal.disabledOfferId
};


  this.helperRequestsService.updateProposal(this.selectedProposal.id, updateData).subscribe({
    next: () => {
      console.log('Proposal updated');

      const index = this.helperProposals.findIndex(p => p.id === this.selectedProposal.id);
      if (index !== -1) {
        this.helperProposals[index] = { ...this.helperProposals[index], ...updateData };
      }

      this.closeViewModal();
    },
    error: (err) => console.error(' Error updating proposal:', err)
  });
}


closeViewModal() {
  this.showViewModal = false;
  this.selectedProposal = null;
  this.editableProposal = {};
  this.isEditing = false;
}
deleteProposal(id: number) {
  const confirmDelete = confirm('Are you sure you want to delete this proposal?');
  if (!confirmDelete) return;

  this.helperRequestsService.deleteProposal(id).subscribe({
    next: () => {
      this.helperProposals = this.helperProposals.filter(p => p.id !== id);
      console.log('Proposal deleted successfully');
    },
    error: (err) => {
      console.error('Failed to delete proposal:', err);
    }
  });
}


openDeleteModal(id: number): void {
  this.requestIdToDelete = id;
  this.showDeleteModal = true;
}

closeDeleteModal(): void {
  this.showDeleteModal = false;
  this.requestIdToDelete = null;
}

confirmDelete(): void {
  if (this.requestIdToDelete != null) {
    this.helperRequestsService.deleteProposal(this.requestIdToDelete).subscribe({
      next: () => {
        this.helperProposals = this.helperProposals.filter(p => p.id !== this.requestIdToDelete);
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error deleting request:', err);
        this.closeDeleteModal();
      }
    });
  }
}
applyFilters() {
  const filtered = this.allProposals.filter(p =>
    (!this.statusFilter || p.status === this.statusFilter) &&
    (!this.categoryFilter || p.categoryName === this.categoryFilter) &&
    (!this.searchWord || p.message?.toLowerCase().includes(this.searchWord.toLowerCase()))
  );

  this.totalItems = filtered.length;

  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.helperProposals = filtered.slice(startIndex, endIndex);
}

loadPagedProposals(helperId: number) {
  this.helperRequestsService
    .getRequestCardsByHelperId(helperId, 1, 1000) 
    .subscribe({
      next: (res) => {
        this.allProposals = res.items;
        this.applyFilters();
      },
      error: (err) => console.error('Error fetching proposal cards:', err)
    });
}

changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.applyFilters(); 
  }
}


get totalPages(): number {
  return Math.ceil(this.totalItems / this.pageSize);
}

}