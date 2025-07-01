import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from 'components/footer/footer.component';


@Component({
  selector: 'app-patient-profile',
  standalone: true,
  templateUrl: './patientProfile.component.html',
  styleUrls: ['./patientProfile.component.css'],
  imports: [FooterComponent,CommonModule, RouterModule]
})
export class PatientProfileComponent implements OnInit {
  patient: any;

  ngOnInit(): void {
    // take data from api
    this.patient = {
      fullName: 'Aya El-Zoghby',
      gender: 'Female',
      phone:'01034638294',
      dateOfBirth: '1998-04-12',
      region:'Giza',
      address: '25 street Al-tahreir,Cairo,',
      disabilityType: 'Mobility Impairment',
      medicalConditionDescription: 'Needs assistance with daily activities.',
      emergencyContactName: 'Eman El-Zoghby',
      emergencyContactRelation: 'Sister',
      emergencyContactPhone: '0102465743',
      image: '/loginImg.png'
    };
  }

  getAge(dob: string): number {
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  }
}

  