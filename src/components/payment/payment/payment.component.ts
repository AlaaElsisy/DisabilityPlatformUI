
import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentService } from '@services/payment/payment.service';
import { Payment } from 'app/models/payment';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PayButtonComponent } from '../pay-button.component/pay-button.component.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, PayButtonComponent],
})
export class PaymentComponent implements OnInit {
  @ViewChild('paymentForm') paymentForm!: NgForm;

  payment: Payment = {
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

  patientName = 'John Doe';
  helperName = 'Helper Smith';
  serviceName = 'Wheelchair Support';
  paymentResult: any = null;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {}

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
    // Reset the form
    this.paymentForm.resetForm();
    
    // Reset the payment object to initial values
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

   helperId = 1;
}