import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderOrdersServicesService } from 'core/services/provider-orders-services.service';
import { IproviderOrders } from 'core/interfaces/iprovider-orders';
import { HelperservicesService } from 'core/services/helperservices.service';
import { Ihelperservices } from 'core/interfaces/ihelperservices';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-provider-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './provider-orders.component.html',
  styleUrl: './provider-orders.component.css'
})
export class ProviderOrdersComponent implements OnInit {
  private _ActivatedRoute = inject(ActivatedRoute);
  private _ProviderOrdersServicesService = inject(ProviderOrdersServicesService);
  private _helperService = inject(HelperservicesService);

  Orders: IproviderOrders[] = [];
  filteredOrders: IproviderOrders[] = [];
  paginatedOrders: IproviderOrders[] = [];

  public _service!: Ihelperservices;
  totalOrders!: number;
  serviceId!: number;
  isAcceptedAlready: boolean = false;

  showConfirmModal: boolean = false;
  selectedOrderId: number | null = null;

  // Filtering & Pagination
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 3;
  totalPages: number = 0;

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        const id = p.get('id');
        if (id) {
          this.serviceId = +id;
          const token = localStorage.getItem('token');
          const headers = { Authorization: `Bearer ${token}` };

          this._helperService.getServiceById(this.serviceId, headers).subscribe({
            next: (res) => {
              this._service = res;
            }
          });

          this._ProviderOrdersServicesService.getServiceOrders(this.serviceId).subscribe({
            next: (res) => {
              this.Orders = res.items;
              this.totalOrders = res.totalCount;
              this.isAcceptedAlready = this.Orders.some(order => order.status.toLowerCase() === 'accepted');
              this.filterOrders();
            },
            error(err) {
              console.log(err);
            }
          });
        }
      }
    });
  }

  filterOrders(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredOrders = this.Orders.filter(order =>
      order.description.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term) ||
      order.price.toString().includes(term)
    );
    this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
    this.paginatedOrders = this.filteredOrders.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  changePage(step: number): void {
    this.page += step;
    if (this.page < 1) this.page = 1;
    if (this.page > this.totalPages) this.page = this.totalPages;
    this.paginatedOrders = this.filteredOrders.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  openModal(orderId: number): void {
    this.selectedOrderId = orderId;
    this.showConfirmModal = true;
  }

  confirmAccept(event?: Event): void {
    if (event) event.stopPropagation();
    if (this.selectedOrderId != null) {
      const acceptedId = this.selectedOrderId;

      this._ProviderOrdersServicesService.changeServiceStatus(acceptedId, 1).subscribe({
        next: () => {
          const otherOrders = this.Orders.filter(o => o.id !== acceptedId);
          otherOrders.forEach((order) => {
            this._ProviderOrdersServicesService.changeServiceStatus(order.id, 2).subscribe();
          });

          this._ProviderOrdersServicesService.changeHelperServiceStatus(this.serviceId, 1).subscribe();

          this.Orders = this.Orders.map(order => {
            if (order.id === acceptedId) {
              return { ...order, status: 'Accepted' };
            } else {
              return { ...order, status: 'Rejected' };
            }
          });

          this.isAcceptedAlready = true;
          this.filterOrders();
        },
        complete: () => {
          this.showConfirmModal = false;
          this.selectedOrderId = null;
        }
      });
    }
  }

  cancelAccept(): void {
    this.showConfirmModal = false;
    this.selectedOrderId = null;
  }
}
