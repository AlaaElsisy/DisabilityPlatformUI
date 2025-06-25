import { Component, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { PatientnavbarComponent } from "../patientnavbar/patientnavbar.component";
@Component({
  selector: 'app-patient-profile',
  templateUrl: './patientProfile.component.html',
  styleUrls: ['./patientProfile.component.css'],
  imports: [FooterComponent, RouterModule, PatientnavbarComponent],
  encapsulation: ViewEncapsulation.None, 
})
export class PatientProfileComponent {}
