import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PatientnavbarComponent } from '../patientnavbar/patientnavbar.component';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, PatientnavbarComponent],
  template: `
    <app-patientnavbar></app-patientnavbar>
    <section class="main-section">
      <router-outlet></router-outlet>
    </section>
  `
})
export class PatientLayoutComponent {}
