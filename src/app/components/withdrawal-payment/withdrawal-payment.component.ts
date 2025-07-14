import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { WithdrawalPaymentService, WithdrawalPaymentData } from '@services/payment/withdrawal-payment.service';

@Component({
  selector: 'app-withdrawal-payment',
  templateUrl: './withdrawal-payment.component.html',
  styleUrls: ['./withdrawal-payment.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class WithdrawalPaymentComponent implements OnInit {
  @ViewChild('withdrawalForm') withdrawalForm!: NgForm;

  withdrawalData: WithdrawalPaymentData = {
    amount: 200,
    bankAccountNumber: '',
    bankName: '',
    accountHolderName: '',
    currency: 'egp'
  };

  helperBalance: number = 0;
  helperName: string = '';
  paymentResult: any = null;
  isLoading: boolean = false;

  constructor(
    private router: Router, 
    private withdrawalPaymentService: WithdrawalPaymentService
  ) {}

  ngOnInit(): void {
    this.loadHelperData();
  }

  loadHelperData() {
    this.withdrawalPaymentService.getHelperBalance().subscribe({
      next: (data: any) => {
        this.helperBalance = data.balance || 0;
        this.helperName = data.user?.fullName || 'Helper';
      },
      error: (err) => {
        console.error('Error loading helper data:', err);
      }
    });
  }

  async submitWithdrawal() {
    if (!this.withdrawalData.bankAccountNumber || 
        !this.withdrawalData.bankName || 
        !this.withdrawalData.accountHolderName || 
        !this.withdrawalData.amount) {
      this.paymentResult = { success: false, message: 'Please fill all withdrawal details.' };
      return;
    }

    if (this.withdrawalData.amount < 200) {
      this.paymentResult = { success: false, message: 'Minimum withdrawal amount is 200 EGP.' };
      return;
    }

    if (this.withdrawalData.amount > this.helperBalance) {
      this.paymentResult = { success: false, message: 'Insufficient balance.' };
      return;
    }

    this.isLoading = true;
    this.paymentResult = null;

    this.withdrawalPaymentService.processWithdrawal(this.withdrawalData).subscribe({
      next: (res: any) => {
        this.paymentResult = { 
          success: res.success, 
          message: res.message,
          transactionId: res.transactionId 
        };
        
        if (res.success) {
          // Update local balance
          this.helperBalance -= this.withdrawalData.amount;
          
          // Reset form after successful withdrawal
          setTimeout(() => {
            this.resetForm();
            this.router.navigate(['/provider/profile']); // Navigate back to provider profile
          }, 2000);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.paymentResult = { 
          success: false, 
          message: err.error?.message || 'Withdrawal failed. Please try again.' 
        };
        this.isLoading = false;
      }
    });
  }

  resetForm() {
    this.withdrawalForm.resetForm();
    this.withdrawalData = {
      amount: 200,
      bankAccountNumber: '',
      bankName: '',
      accountHolderName: '',
      currency: 'egp'
    };
    this.paymentResult = null;
  }

  goBack() {
    this.router.navigate(['/provider/profile']);
  }
} 