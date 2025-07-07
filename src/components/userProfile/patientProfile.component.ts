import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  UserProfileService } from '@services/user-self-profile.service';
import { HelperProfile } from 'app/models/helper-profile.model';
import { PatientProfile } from 'app/models/patient-profile.model';


@Component({
  selector: 'app-patient-profile',
  standalone: true,
  templateUrl: './patientProfile.component.html',
  styleUrls: ['./patientProfile.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class UserProfileComponent implements OnInit {
  patientProfile!: PatientProfile;
  helperProfile!: HelperProfile;
  userProfile! : PatientProfile | HelperProfile | null ;
  role: string | null = null;
  errorMessage: string = '';

  constructor(private userProfileService: UserProfileService) {}

  ngOnInit(): void {
     this.role = localStorage.getItem('role');

    this.userProfileService.getProfile().subscribe({
      next: (profile) => {
        if (this.role?.toLocaleLowerCase() === 'helper') {
          this.helperProfile = profile as HelperProfile;
          this.userProfile = this.helperProfile;
        }
        else if (this.role?.toLocaleLowerCase() === 'patient') {
          this.patientProfile = profile as PatientProfile;
          this.userProfile = this.patientProfile;
        }
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load user profile';
      }
    });



  }
}

