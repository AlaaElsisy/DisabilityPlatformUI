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

  requestForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  success = false;

  constructor() {
    this.requestForm = this.formBuilder.group({
      serviceNeeded: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateTime: ['', Validators.required],
      location: ['', Validators.required],
      estimatedHours: ['', [Validators.required, Validators.min(1)]],
      expectedCost: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.success = false;

    const formData: ServiceRequest = {
      ...this.requestForm.value,
      // Convert string dates to Date objects if needed
      dateTime: new Date(this.requestForm.value.dateTime)
    };

    this.addProposalServiceService.createServiceRequest(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.success = true;
        this.requestForm.reset();
        // You might want to navigate away or show a success message
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to submit request. Please try again.';
        console.error('Submission error:', err);
      }
    });
  }
}
