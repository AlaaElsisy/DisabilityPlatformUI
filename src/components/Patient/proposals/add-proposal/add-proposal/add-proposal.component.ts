import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddProposalServiceService } from '@services/add-proposal-service.service';
import { ServiceRequest } from 'app/models/add-proposal.model';

@Component({
  selector: 'app-add-proposal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-proposal.component.html',
  styleUrls: ['./add-proposal.component.css']
})
export class AddProposalComponent {
  private formBuilder = inject(FormBuilder);
  private addProposalServiceService = inject(AddProposalServiceService);

  serviceForm: FormGroup;
  serviceForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  success = false;
  isSubmitted = false;

  services: string[] = [
    'Medical Service',
    'Delivery Service',
    'Driver Service',
    'Public Services'
  ];
  isSubmitted = false;

  services: string[] = [
    'Caregiving',
    'Transportation',
    'Medical Assistance',
    'Grocery Shopping',
    'Housekeeping',
    'Companionship'
  ];

  constructor() {
    this.serviceForm = this.formBuilder.group({
    this.serviceForm = this.formBuilder.group({
      serviceNeeded: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateTime: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(5)]],
      estimatedHours: ['', [Validators.required, Validators.min(1), Validators.max(24)]],
      location: ['', [Validators.required, Validators.minLength(5)]],
      estimatedHours: ['', [Validators.required, Validators.min(1), Validators.max(24)]],
      expectedCost: ['', [Validators.required, Validators.min(0)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.serviceForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.success = false;

    const formData: ServiceRequest = {
      ...this.serviceForm.value,
      dateTime: new Date(this.serviceForm.value.dateTime)
      ...this.serviceForm.value,
      dateTime: new Date(this.serviceForm.value.dateTime)
    };

    this.addProposalServiceService.createServiceRequest(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.success = true;
        this.isSubmitted = true;
        this.serviceForm.reset();
        this.isSubmitted = true;
        this.serviceForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to submit request. Please try again.';
        console.error('Submission error:', err);
      }
    });
  }
}
