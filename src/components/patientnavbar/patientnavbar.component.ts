import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-patientnavbar',
  standalone: true,
  imports: [RouterModule], 
  templateUrl: './patientnavbar.component.html',
  styleUrls: ['./patientnavbar.component.css'] 
})
export class PatientnavbarComponent {
  constructor(private router: Router) {}

  logout() {
 
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
