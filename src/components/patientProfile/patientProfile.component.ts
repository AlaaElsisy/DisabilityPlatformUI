import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  UserProfileService } from '@services/patient-profile.service';
import { PatientProfile } from 'app/models/patient-profile.model';
import { HelperProfile } from 'app/models/helper-profile.model';


@Component({
  selector: 'app-patient-profile',
  standalone: true,
  templateUrl: './patientProfile.component.html',
  styleUrls: ['./patientProfile.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class UserProfileComponent implements OnInit {
  disabledProfile?: PatientProfile;
  helperProfile?: HelperProfile;
  errorMessage = '';

  constructor(private profileService: UserProfileService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Try to load disabled user profile
    this.profileService.getDisabledProfile().subscribe({
      next: (data) => this.disabledProfile = data,
      error: () => {
        // If not found, try to load helper profile
        this.profileService.getHelperProfile().subscribe({
          next: (data) => this.helperProfile = data,
          error: () => this.errorMessage = 'No user profile found.'
        });
      }
    });
  }
}

