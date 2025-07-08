
import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentService } from '@services/payment/payment.service';
import { Payment } from 'app/models/payment';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

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
    amount: 45,//static amount for testing
    token: '',
    paymentMethod: 'card',
    toHelperId: 1,
    fromPatientId: 2,
    helperRequestId: 1,         
    disabledRequestId: null      
  };

patientName: string = '';
helperName: string = '';
serviceName: string = '';
paymentResult: any = null;


  constructor(private paymentService: PaymentService) {}
ngOnInit() {
  const navState = history.state;
  this.patientName = navState.patientName || 'N/A';
  this.helperName = navState.helperName || 'N/A';
  this.serviceName = navState.serviceName || 'N/A';
  this.payment.amount = navState.amount || 0;
  this.payment.disabledRequestId = navState.disabledRequestId || null;
}




  async submitPayment() {
  if (!this.payment.cardNumber || !this.payment.expMonth || !this.payment.expYear || !this.payment.cvc || !this.payment.amount) {
    this.paymentResult = { success: false, message: 'Please fill all payment details.' };
    return;
  }

  const paymentRequest = {
    Amount: this.payment.amount,
    Currency: 'egp',
    CardNumber: this.payment.cardNumber,
    ExpMonth: this.payment.expMonth,
    ExpYear: this.payment.expYear,
    Cvc: this.payment.cvc,
    HelperRequestId: this.payment.helperRequestId,
    DisabledRequestId: this.payment.disabledRequestId
  };

  this.paymentService.chargeCard(paymentRequest).subscribe({
    next: (res: any) => {
      this.paymentResult = { 
        success: res.success, 
        message: res.message,
        paymentId: res.paymentId 
      };
      
      if (res.success) {

       this.paymentService.patchRequestStatus(this.payment.disabledRequestId!, '3').subscribe({
          next: () => {
            console.log("Request status updated to Completed");
          },
          error: (err) => {
            console.error("Failed to update request status:", err);
          }
        });

        this.resetForm();
      }
    },
    error: (err) => {
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
      paymentMethod: 'card',
      toHelperId: 1,
      fromPatientId: 2,
      helperRequestId: 1,         
      disabledRequestId: null      
    };
  }

 
}