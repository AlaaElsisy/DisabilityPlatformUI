import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddProposalServiceService } from '@services/add-proposal-service.service';
import { ServiceRequest } from 'app/models/add-proposal.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-proposal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-proposal.component.html',
  styleUrls: ['./add-proposal.component.css']
})
export class AddProposalComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private addProposalServiceService = inject(AddProposalServiceService);
  private route = inject(ActivatedRoute);

  serviceForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  success = false;
  isSubmitted = false;

  categories: any[] = [];
  selectedCategoryId: string | null = null;

  constructor() {
   this.serviceForm = this.formBuilder.group(
  {
    serviceNeededId: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(20)]],
    startDateTime: ['', Validators.required],
    endDateTime: ['', Validators.required],
    location: ['', [Validators.required, Validators.minLength(5)]],
    expectedCost: ['', [Validators.required, Validators.min(0)]],
  },
  { validators: this.dateValidator }
);

  }

  ngOnInit(): void {
    this.selectedCategoryId = this.route.snapshot.queryParamMap.get('categoryId');
    this.addProposalServiceService.getServiceCategories().subscribe({
      next: (data) => {
        this.categories = data;
        if (this.selectedCategoryId && this.categories.some(cat => cat.id == this.selectedCategoryId)) {
          this.serviceForm.patchValue({ serviceNeededId: this.selectedCategoryId });
        }
      },
      error: (err) => {
        console.error('Error fetching categories', err);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.serviceForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }
dateValidator(group: FormGroup) {
  const start = new Date(group.get('startDateTime')?.value);
  const end = new Date(group.get('endDateTime')?.value);
  const now = new Date();
  now.setSeconds(0, 0); 

  const errors: any = {};

  if (start < now) {
    errors.startInPast = true;
  }

  if (end <start) {
    errors.endBeforeStart = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

  onSubmit(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.success = false;

  const formData: ServiceRequest = {
  description: this.serviceForm.value.description,
  offerPostDate: new Date(), 
  startServiceTime: new Date(this.serviceForm.value.startDateTime),
  endServiceTime: new Date(this.serviceForm.value.endDateTime),
  budget: this.serviceForm.value.expectedCost,
  serviceCategorId: this.serviceForm.value.serviceNeededId
};


    this.addProposalServiceService.createServiceRequest(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.success = true;
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
