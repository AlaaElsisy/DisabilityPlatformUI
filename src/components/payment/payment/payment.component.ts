
import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentService } from '@services/payment/payment.service';
import { Payment } from 'app/models/payment';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperRequestService } from 'app/services/helper-request.service';
import { DisabledOfferService } from '@services/disabled-offer.service';

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

  patientName = '';
  helperName = '';
  serviceName = '';
  paymentResult: any = null;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private helperRequestService: HelperRequestService , 
    private disabledOfferService: DisabledOfferService,

  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as any;
    if (state) {
      this.payment.amount = state.amount || null;
      this.payment.helperRequestId = state.helperRequestId || null;
      this.payment.disabledRequestId = state.disabledRequestId || null;
      this.payment.offerId = state.offerId || null ;
    } 
  }



  ngOnInit(): void {
    if (this.payment.helperRequestId) {
      this.helperRequestService.getHelperRequestById(this.payment.helperRequestId).subscribe({
        next: (request) => {
          console.log(request)
          this.helperName = request.helperName || 'N/A';
          this.serviceName = request.service || 'N/A';
          this.patientName = request.disabledName || 'N/A';
        },
        error: () => {
          this.helperName = 'N/A';
          this.serviceName = 'N/A';
          this.patientName = 'N/A';
        }
      });
    }
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
          const offerId = this.payment.offerId || null;
          const helperRequestId = this.payment.helperRequestId || null;
          this.resetForm();
          if (offerId != null) {
            if (!helperRequestId) return;
            this.helperRequestService.updateProposalStatus(helperRequestId, 'Completed').subscribe({
              next: () => {
                this.disabledOfferService.updateOfferStatus(offerId, 'Completed').subscribe();
                // 1. اعرض رسالة النجاح
                this.paymentResult = { success: true, message: 'Successful payment!' };
                // 2. انتظر ثانية ثم انتقل
                setTimeout(() => {
                  this.router.navigate([`/offers/${offerId}/proposals`], {
                    state: {
                      markCompleted: true,
                      helperRequestId: this.payment.helperRequestId,
                      offerId: offerId
                    }
                  });
                }, 1000);
              },
              error: err => alert('Failed to mark as completed: ' + (err?.error?.message || err.message || err))
            });
          }
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
      offerId: null,
      paymentMethod: 'card',
      helperRequestId: null,         
      disabledRequestId: null      
    };
  }

 
}