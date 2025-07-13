import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HelperservicesService } from '../../core/services/helperservices.service';
import { Router } from '@angular/router';
import { Ihelperservices } from '../../core/interfaces/ihelperservices';
import { CommonModule } from '@angular/common';
import { GetloggineduserDataService } from 'core/services/getloggineduser-data.service';

@Component({
  standalone: true,
  selector: 'app-providerservices',
  templateUrl: './providerservices.component.html',
  styleUrl: './providerservices.component.css',
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FormsModule]
})
export class ProviderservicesComponent implements OnInit {
  AllServices: Ihelperservices[] = [];
  userid!: number;

  // Filtering + Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  searchTerm: string = '';
  statusFilter: string = 'all';

  private router = inject(Router);
  private readonly _getLoggingHelper = inject(GetloggineduserDataService);
  private readonly _helperservicesService = inject(HelperservicesService);

  ngOnInit(): void {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this._getLoggingHelper.getuserData().subscribe({
    next: (value) => {
      this.userid = value.id;

      this._helperservicesService.gethelprservices(this.userid, headers).subscribe({
        next: (res) => {
          const now = new Date();
          this.AllServices = res;
          this.AllServices.forEach(service => {
            const endDate = new Date(service.availableDateTo);
            if (endDate < now && service.status !== 2 && service.status !== 3) {
              this._helperservicesService.updateStatus(service.id, 2, headers).subscribe({
                next: () => {
                  service.status = 2; 
                  console.log(`Service ${service.id} marked as cancelled`);
                },
                error: (err) => console.error(`Failed to update service ${service.id}`, err)
              });
            }
          });
        },
        error: (err) => console.log(err)
      });
    },
    error: (err) => console.log(err)
  });
}


  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'pending';
      case 1: return 'accepted';
      case 2: return 'cancelled';
      case 3: return 'completed';
      default: return 'unknown';
    }
  }

  get filteredServices(): Ihelperservices[] {
    return this.AllServices.filter(service => {
      const matchesSearch = service.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || this.getStatusText(service.status).toLowerCase() === this.statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }

  get paginatedServices(): Ihelperservices[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredServices.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredServices.length / this.pageSize);
  }

  deleteService(id: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this._helperservicesService.helperDeleteservice(id, headers).subscribe({
      next: () => this.ngOnInit(),
      error: (err) => console.log(err)
    });
  }

  editService(id: number): void {
    this.router.navigate(['/provider/helperaddservice', id]);
  }

  goTosericrPropozels(id: number): void {
    this.router.navigate(['/provider/orders', id]);
  }

  addservice() {
    this.router.navigate(['/provider/helperaddservice']);
  }
}
