import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
        email: ['', [Validators.required, Validators.email]],
        region: [''],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        address: [''],
        dateOfBirth: [''],
        gender: ['', Validators.required],
        role: ['', Validators.required],

        disabilityType: [''],
        medicalConditionDescription: [''],
        emergencyContactName: [''],
        emergencyContactRelation: [''],
        emergencyContactPhone: [''],
        bio: ['']
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  get role() {
    return this.signupForm.get('role')?.value;
  }


  passwordsMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Form submitted:', this.signupForm.value);
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
