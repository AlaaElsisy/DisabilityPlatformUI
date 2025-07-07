import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  Input } from '@angular/core';
import { PaymentService } from '@services/payment/payment.service';

@Component({
  selector: 'app-pay-button.component',
 standalone: true,                 
  imports: [CommonModule], 
  templateUrl: './pay-button.component.component.html',
  styleUrl: './pay-button.component.component.css'
})
export class PayButtonComponent {
  // @Input() helperRequestId?: number;
  // @Input() disabledRequestId?: number;

  constructor(private paymentService: PaymentService) {}

  payForRequest() {
    const payload = {
      helperRequestId:null,
      // helperRequestId: this.helperRequestId,

       disabledRequestId: 1001,
      // disabledRequestId: this.disabledRequestId

    };

    this.paymentService.createPayment(payload).subscribe({
      next: (res) => {
        if (res.sessionUrl) {
          window.location.href = res.sessionUrl;  
        } else {
          alert('Failed to start payment: No URL received');
        }
      },
      error: () => {
        alert('Failed to start payment');
      }
    });
  }
}