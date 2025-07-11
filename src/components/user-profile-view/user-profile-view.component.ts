import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfileViewService } from '@services/user-profile-view.service';
import { HelperProfile } from 'app/models/helper-profile.model';
import { PatientProfile } from 'app/models/patient-profile.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile-view',
  imports: [CommonModule],
  templateUrl: './user-profile-view.component.html',
  styleUrl: './user-profile-view.component.css'
})
export class UserProfileViewComponent implements OnInit {
  patientProfile!: PatientProfile;
  helperProfile!: HelperProfile;
  userProfile!: PatientProfile | HelperProfile;
  errorMessage: string = '';
  role: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private userProfileService: UserProfileViewService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    this.role = this.route.snapshot.queryParamMap.get('role');
 
    if (userId && this.role) {
      this.userProfileService.getProfileFromUrl(userId, this.role).subscribe({
        next: (profile) => {
          
          if (this.role?.toLowerCase() === 'patient') {
            this.patientProfile = profile as PatientProfile;
          } else if (this.role?.toLowerCase() === 'helper') {
            this.helperProfile = profile as HelperProfile;
          }
          this.userProfile = profile;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load user profile';
        }
      });
    } else {
      this.errorMessage = 'Missing userId or role in URL';
    }
  }
}
