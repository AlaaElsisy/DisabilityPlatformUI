import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d).+$/)
        ]
      ]
    });
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.authService.login(loginData).subscribe({
        next: (res) => {
          const token = res.token;
          localStorage.setItem('authToken', token);
          localStorage.setItem('token', token);

          const decodedToken = this.decodeToken(token);
          console.log('Decoded Token:', decodedToken); 

          const rawRole = decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          const role = rawRole?.toLowerCase();

          console.log('Extracted Role:', role); 

          if (role === 'patient') {
            this.router.navigate(['/patienthome']);
          } else if (role === 'helper') {
            this.router.navigate(['/provider/home']);
          } else {
            console.warn('Unknown role:', role);
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          alert('Invalid email or password!');
        }
      });
    }
  }
}
