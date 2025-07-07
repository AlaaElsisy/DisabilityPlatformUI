import { Router, ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { ProviderOrdersServicesService } from 'core/services/provider-orders-services.service';
import { IproviderOrders } from 'core/interfaces/iprovider-orders';
import { HelperservicesService } from 'core/services/helperservices.service';
import { Ihelperservices } from 'core/interfaces/ihelperservices';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-provider-orders',
  imports: [CommonModule],
  templateUrl: './provider-orders.component.html',
  styleUrl: './provider-orders.component.css'
})
export class ProviderOrdersComponent implements OnInit {
  private _ActivatedRoute = inject(ActivatedRoute);
  private _ProviderOrdersServicesService = inject(ProviderOrdersServicesService);
  private _helperService = inject(HelperservicesService);

  Orders: IproviderOrders[] = [];
  public _service!: Ihelperservices;
  totalOrders!: number;
  serviceId!: number;
  isAcceptedAlready: boolean = false;


  showConfirmModal: boolean = false;
  selectedOrderId: number | null = null;

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
              console.log(res)
                  this.isAcceptedAlready = this.Orders.some(order => order.status.toLowerCase() === 'accepted');
              this.totalOrders = res.totalCount;
           
           



            },
            error(err) {
              console.log(err);
            }
          });
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  openModal(orderId: number): void {
    this.selectedOrderId = orderId;
    this.showConfirmModal = true;
    console.log(`Modal opened for order ID: ${orderId}`);
  }

confirmAccept(event?: Event): void {
  if (event) event.stopPropagation();
  if (this.selectedOrderId != null) {
    const acceptedId = this.selectedOrderId;

    // 1. Accept the selected order
    this._ProviderOrdersServicesService.changeServiceStatus(acceptedId, 1).subscribe({
      next: (res) => {
        console.log('Accepted order with ID:', acceptedId);

        // 2. Reject all other orders
        const otherOrders = this.Orders.filter(o => o.id !== acceptedId);
        otherOrders.forEach((order) => {
          this._ProviderOrdersServicesService.changeServiceStatus(order.id, 2).subscribe({
            next: () => console.log(`Rejected order ID: ${order.id}`),
            error: (err) => console.error(`Failed to reject order ID: ${order.id}`, err)
          });
        });

        // 3. Change helper service status to Accepted (as "Completed")
        this._ProviderOrdersServicesService.changeHelperServiceStatus(this.serviceId, 1).subscribe({
          next: (res) => console.log('Helper service marked as Completed (Accepted)', res),
          error: (err) => console.error('Failed to update helper service status', err)
        });

        // 4. Update UI
        this.Orders = this.Orders.map(order => {
          if (order.id === acceptedId) {
            return { ...order, status: 'Accepted' };
          } else {
            return { ...order, status: 'Rejected' };
          }
        });

        this.isAcceptedAlready = true;
      },
      error: (err) => {
        console.error('Failed to accept order', err);
      },
      complete: () => {
        this.showConfirmModal = false;
        this.selectedOrderId = null;
      }
    });
  }
}



  cancelAccept(): void {
    console.log('Acceptance cancelled');
    this.showConfirmModal = false;
    this.selectedOrderId = null;
  }
 

  
}
