import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfileViewService } from '@services/user-profile-view.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile-view',
  imports: [CommonModule],
  templateUrl: './user-profile-view.component.html',
  styleUrl: './user-profile-view.component.css'
})
export class UserProfileViewComponent implements OnInit {
  userId!: string;
  userProfile: any;
  errorMessage = '';
  role: string = '';

  constructor(
    private route: ActivatedRoute,
    private userProfileViewService: UserProfileViewService
  ) {}

  ngOnInit(): void {
   this.role = this.userProfileViewService.getUserRoleFromToken() ?? '';
   console.log('User Role:', this.role);

  this.userId = this.route.snapshot.paramMap.get('id') ?? '';
  if (this.userId) {
    this.userProfileViewService.getUserProfileById(this.userId).subscribe({
      next: (data) => this.userProfile = data,
      error: () => this.errorMessage = 'User profile not found.'
    });
  }
  }
}
