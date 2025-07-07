import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PatientnavbarComponent } from '../patientnavbar/patientnavbar.component';
import { FooterComponent } from '../footer/footer.component';
import { PayButtonComponent } from 'components/payment/pay-button.component/pay-button.component.component';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, PatientnavbarComponent , FooterComponent],
  templateUrl: './patient-layout.component.html'
})
export class PatientLayoutComponent {}
