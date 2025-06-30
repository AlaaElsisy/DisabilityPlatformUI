import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-proposal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-proposal.component.html',
  styleUrls: ['./add-proposal.component.css']
})
export class AddProposalComponent {
  serviceForm: FormGroup;
  isLoading = false;
  isSubmitted = false;

  services: string[] = [
    'Personal Care',
    'Companion Care',
    'Medical Transportation',
    'Sign Language Support',
    'Mobility Assistance'
  ];

  constructor(private fb: FormBuilder) {
    this.serviceForm = this.fb.group({
      serviceNeeded: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      dateTime: ['', [Validators.required, this.futureDateValidator()]],
      location: ['', [Validators.required, Validators.minLength(5)]],
      estimatedHours: ['', [Validators.required, Validators.min(1), Validators.max(24)]],
      expectedCost: ['', [Validators.required, Validators.min(0)]]
    });
  }

  futureDateValidator() {
    return (control: any) => {
      const selectedDate = new Date(control.value);
      const now = new Date();
      return selectedDate > now ? null : { pastDate: true };
    };
  }

  onSubmit() {
    if (this.serviceForm.valid) {
      this.isLoading = true;

      // Simulate API call
      setTimeout(() => {
        console.log('Service Request:', this.serviceForm.value);
        this.isLoading = false;
        this.isSubmitted = true;
        this.serviceForm.reset();

        // Reset submission status after 5 seconds
        setTimeout(() => {
          this.isSubmitted = false;
        }, 5000);
      }, 1500);
    }
  }

  // Helper method to check field validity
  isFieldInvalid(field: string): boolean {
    const control = this.serviceForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
