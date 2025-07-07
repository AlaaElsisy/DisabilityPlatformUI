import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '@services/payment/payment.service';

@Component({
  selector: 'app-payment-success.component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.component.component.html',
  styleUrl: './payment-success.component.component.css'
})
export class PaymentSuccessComponentComponent implements OnInit {
  transactionId: string = '';
  amountPaid: number = 0;
  loading: boolean = true;
  success: boolean = false;
  error: string = '';


  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('sessionId');

    if (!sessionId) {
      this.error = 'Invalid payment session.';
      this.loading = false;
      return;
    }

    this.paymentService.confirmPayment(sessionId).subscribe({
      next: (res) => {
        this.transactionId = res.transactionId;
        this.amountPaid = res.amountPaid;
        this.success = true;
        this.loading = false;

        this.performAfterSuccessActions();   
      },
      error: () => {
        this.error = 'Payment confirmation failed.';
        this.loading = false;
      }
    });
  }

  performAfterSuccessActions(): void {
    console.log('✅ Payment successful—performing after-success actions...');
   
  }
}
