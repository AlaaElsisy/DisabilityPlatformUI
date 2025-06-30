import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {

    this.signupForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
        region: ['',Validators.minLength(7)],
        email: ['', [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]],
        password: ['', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d).+$/)
        ]],

        confirmPassword: ['', Validators.required],
        address: [''],
        dateOfBirth: ['',Validators.required],
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
  console.log('Aya');
  if (this.signupForm.valid) {
    const formData = this.signupForm.value;

    this.authService.register(formData).subscribe({
      next: (res) => {
        alert(res.message);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        alert(err.error?.message || 'Registration failed');
      }
    });
  } else {
    this.signupForm.markAllAsTouched();
  }
}

testClick() {
  console.log("Button clicked!");
}
}
