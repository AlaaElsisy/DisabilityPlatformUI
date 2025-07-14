import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderOrdersServicesService } from 'core/services/provider-orders-services.service';
import { IproviderOrders } from 'core/interfaces/iprovider-orders';
import { HelperservicesService } from 'core/services/helperservices.service';
import { Ihelperservices } from 'core/interfaces/ihelperservices';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalrService } from 'app/services/signalr.service';
import { DisabledDataService } from 'core/services/disabled-data.service';
import { IDisabledData } from 'core/interfaces/idisabled-data';

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
  private signalrService = inject(SignalrService);
  private disabledDataService = inject(DisabledDataService);
private readonly route=inject(Router)
  Orders: IproviderOrders[] = [];
  OrdersWithDisabledData: { order: IproviderOrders; data: IDisabledData }[] = [];
  filteredOrders: { order: IproviderOrders; data: IDisabledData }[] = [];
  paginatedOrders: { order: IproviderOrders; data: IDisabledData }[] = [];

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

              this.Orders.forEach(order => {
                this.disabledDataService.getDisabledDataByUserId(order.userId).subscribe({
                  next: (response: any) => {
                    const data: IDisabledData = {
                      id: response.id,
                      medicalConditionDescription: response.medicalConditionDescription,
                      disabilityType: response.disabilityType,
                      emergencyContactName: response.emergencyContactName,
                      emergencyContactPhone: response.emergencyContactPhone,
                      emergencyContactRelation: response.emergencyContactRelation,
                      userId: response.userId,
                      fullName: response.user.fullName,
                      address: response.user.address,
                      zone: response.user.zone,
                      dateOfBirth: response.user.dateOfBirth,
                      gender: response.user.gender,
                      profileImage: response.user.profileImage
                    };
                    this.OrdersWithDisabledData.push({ order, data });
                    this.filterOrders();
                  }
                });
              });
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
    this.filteredOrders = this.OrdersWithDisabledData.filter(({ order, data }) =>
      order.description.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term) ||
      order.price.toString().includes(term) ||
      data.fullName?.toLowerCase().includes(term) ||
      data.zone?.toLowerCase().includes(term) ||
      data.address?.toLowerCase().includes(term)
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
          const otherOrders = this.OrdersWithDisabledData.filter(o => o.order.id !== acceptedId);
          otherOrders.forEach((o) => {
            this._ProviderOrdersServicesService.changeServiceStatus(o.order.id, 2).subscribe();

            if (o.order.userId) {
              this.signalrService.sendNotificationToClient(`Your order(${o.order.description}) was not accepted.`, o.order.userId);
            }
          });

          this._ProviderOrdersServicesService.changeHelperServiceStatus(this.serviceId, 1).subscribe();

          this.OrdersWithDisabledData = this.OrdersWithDisabledData.map(o => {
            if (o.order.id === acceptedId) {
              return { ...o, order: { ...o.order, status: 'Accepted' } };
            } else {
              return { ...o, order: { ...o.order, status: 'Rejected' } };
            }
          });

          this.isAcceptedAlready = true;
          this.filterOrders();

          const accepted = this.OrdersWithDisabledData.find(o => o.order.id === acceptedId);
          if (accepted?.order.userId) {
            this.signalrService.sendNotificationToClient(`Your order(${accepted.order.description}) has been accepted!`, accepted.order.userId);
          }
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

   gotoPatientProfile(userId: string): void {
    this.route.navigate(['/user-view-profile'], {
      queryParams: { userId, role: 'patient' },
    });
  }
}
