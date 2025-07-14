import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentService } from '@services/payment/payment.service';
import { Payment } from 'app/models/payment';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperRequestService } from 'app/services/helper-request.service';
import { DisabledOfferService } from '@services/disabled-offer.service';
import { PaymentDataService } from '@services/payment/payment-data.service';

import { SignalrService } from '@services/signalr.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PaymentComponent implements OnInit {
  @ViewChild('paymentForm') paymentForm!: NgForm;

  payment: Payment = {
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    amount: 45,
    token: '',
    offerId : null,
    paymentMethod: 'card',
    helperRequestId: null,         
    disabledRequestId: null      
  };

  patientName: string = '';
  helperName: string = '';
  serviceName: string = '';
  paymentResult: any = null;
  isProcessing: boolean = false;

constructor(private router: Router, private paymentService: PaymentService, private paymentDataService: PaymentDataService, private signalrService: SignalrService, private _toster: ToastrService ) {}

ngOnInit(): void {
  const nav = this.router.getCurrentNavigation();
 const state = this.paymentDataService.getData();

if (!state) {
  console.error(" No payment data found in service.");
  return;
}

  this.patientName = state.patientName || 'N/A';
  this.helperName = state.helperName || 'N/A';
  this.serviceName = state.serviceName || 'N/A';
  this.payment.amount = state.amount || 0;
  this.payment.disabledRequestId = state.disabledRequestId ?? null;
  this.payment.helperRequestId = state.helperRequestId ?? null;
    const userId = localStorage.getItem('userId');
  if (userId) {
    this.signalrService.startConnection(userId);
}
}

  async submitPayment() {
    if (!this.payment.cardNumber || !this.payment.expMonth || !this.payment.expYear || !this.payment.cvc || !this.payment.amount) {
     // this.paymentResult = { success: false, message: 'Please fill all payment details.' };
             this._toster.error('Please fill all payment details.');

      return;
    }

    this.isProcessing = true;
    this.paymentResult = null;

   const paymentRequest = {
  Amount: this.payment.amount,
  Currency: 'egp',
  CardNumber: this.payment.cardNumber,
  DisabledRequestId: this.payment.disabledRequestId
};


    this.paymentService.chargeCard(paymentRequest).subscribe({
      next: (res: any) => {
        this.isProcessing = false;
        this.paymentResult = { 
          success: res.success, 
          message: res.message,
          paymentId: res.paymentId 
        };
        
    if (res.success) {
  this.paymentService.getDisabledRequestById(this.payment.disabledRequestId!).subscribe({
    next: (disabledRequest: any) => {
      console.log('Disabled Request:', disabledRequest);

      const requestId = disabledRequest.id;
      const helperServiceId = disabledRequest.helperServiceId;
      const helperUserId = disabledRequest.helperUserId; 

      if (!requestId || !helperServiceId || !helperUserId) {
        console.error('Missing request ID, service ID, or helper user ID');
        return;
      }


      const message = `${this.patientName} has completed the payment for ${this.serviceName}.`;

      if (this.signalrService.isConnected()) {
        this.signalrService.sendNotificationToClient(message, helperUserId)
          .then(() => console.log(" Payment notification sent to helper"))
          .catch(err => console.error(" Error sending notification", err));
      }

      this.paymentService.patchRequestStatus(requestId, '3').subscribe({
        next: () => {
          console.log("Request status updated to Completed");

          this.paymentService.updateServiceStatus(helperServiceId, 3).subscribe({
            next: () => {
              console.log("Service marked as Completed");
              this.resetForm();
              this.router.navigate(['/patient-serviceRequests']);
              this._toster.success('Payment processed successfully.');
            },
            error: err => console.error("Error updating service status", err)
          });
        },
        error: err => console.error("Error updating request status:", err)
      });
    },
    error: (err) => {
      console.error("Error fetching disabled request by ID:", err);
    }
  });


          this.resetForm();
        }
      },
      error: (err) => {
        this.isProcessing = false;
        this.paymentResult = { 
          success: false, 
          message: err.error?.message || 'Payment failed. Please try again.' 
        };
      }
    });
  }

  resetForm() {
    this.paymentForm.resetForm();
    this.payment = {
      cardNumber: '',
      expMonth: '',
      expYear: '',
      cvc: '',
      amount: 0,
      token: '',
      offerId: null,
      paymentMethod: 'card',
      helperRequestId: null,         
      disabledRequestId: null      
    };
  }
}
