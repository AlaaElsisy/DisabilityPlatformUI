import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserProfileService } from '@services/user-self-profile.service';
import { HelperProfile } from 'app/models/helper-profile.model';
import { PatientProfile } from 'app/models/patient-profile.model';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  templateUrl: './patientProfile.component.html',
  styleUrls: ['./patientProfile.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class UserProfileComponent implements OnInit {
  patientProfile!: PatientProfile;
  helperProfile!: HelperProfile;
  userProfile!: PatientProfile | HelperProfile | null;
  role: string | null = null;
  errorMessage: string = '';
  editMode: boolean = false;
  selectedImage: File | null = null;
  form!: FormGroup;
  previewImageUrl: string = '';
successMessage: string = '';

  showWithdrawModal: boolean = false;
  withdrawAmount: number = 200;
  withdrawError: string = '';
  withdrawSuccess: string = '';
  isWithdrawing: boolean = false;
  
  bankAccountNumber: string = '';
  bankName: string = '';
  accountHolderName: string = '';

  constructor(private userProfileService: UserProfileService, private fb: FormBuilder, private router: Router) {}

  formatDateOnly(date: any): string {
    return new Date(date).toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role');

    this.userProfileService.getProfile().subscribe({
      next: (profile) => {
        if (this.role?.toLowerCase() === 'helper') {
          this.helperProfile = profile as HelperProfile;
          this.userProfile = this.helperProfile;
        } else if (this.role?.toLowerCase() === 'patient') {
          this.patientProfile = profile as PatientProfile;
          this.userProfile = this.patientProfile;
        }

        this.previewImageUrl = this.userProfile?.user?.profileImage ?? '';
        this.buildForm(); 
        // Reset withdrawal state
        this.withdrawError = '';
        this.withdrawSuccess = '';
        this.isWithdrawing = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load user profile';
      }
    });
  }

  private buildForm(): void {
    const rawDate = this.userProfile?.user.dateOfBirth;
    const formattedDate = rawDate ? this.formatDateOnly(rawDate) : '';

    const formGroupConfig: any = {
  fullName: [this.userProfile?.user.fullName || ''],
  email: [this.userProfile?.user.email || ''],
  phoneNumber: [this.userProfile?.user.phoneNumber || ''],
  dateOfBirth: [formattedDate],
  gender: [this.userProfile?.user.gender ?? 0],
  address: [this.userProfile?.user.address || ''],
  zone: [this.userProfile?.user.zone || '']
};

if (this.role?.toLowerCase() === 'patient' && this.patientProfile) {
  formGroupConfig['disabilityType'] = [this.patientProfile.disabilityType || ''];
  formGroupConfig['medicalConditionDescription'] = [this.patientProfile.medicalConditionDescription || ''];
  formGroupConfig['emergencyContactName'] = [this.patientProfile.emergencyContactName || ''];
  formGroupConfig['emergencyContactPhone'] = [this.patientProfile.emergencyContactPhone || ''];
  formGroupConfig['emergencyContactRelation'] = [this.patientProfile.emergencyContactRelation || ''];
}

if (this.role?.toLowerCase() === 'helper' && this.helperProfile) {
  formGroupConfig['bio'] = [this.helperProfile.bio ?? ''];
}

this.form = this.fb.group(formGroupConfig);
this.form.disable(); 
  }

  toggleEditMode() {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveChanges() {
  if (!this.form.valid || !this.userProfile || !this.role) return;

  const updatedData: any = {
    ...this.form.value,
    dateOfBirth: this.form.value.dateOfBirth ? new Date(this.form.value.dateOfBirth).toISOString() : null,
    profileImage: this.userProfile.user.profileImage // ده هيتغير بعد رفع الصورة
  };

  if (this.selectedImage) {
    const formData = new FormData();
    formData.append('file', this.selectedImage);

    this.userProfileService.uploadProfileImage(formData).subscribe({
      next: (res) => {
        console.log('Upload response:', res);
        const uploadedPath = typeof res === 'string' ? res : res.imageUrl;
        const fullImageUrl = `${environment.ImagesBaseUrl}${uploadedPath}`;

        updatedData.profileImage = fullImageUrl;
 if (this.userProfile && 'user' in this.userProfile && this.userProfile.user) {
      this.userProfile.user.profileImage = fullImageUrl;
    }        this.previewImageUrl = fullImageUrl;

        this.continueSaving(updatedData);
      },
      error: () => alert('Failed to upload image')
    });
  } else {
    this.continueSaving(updatedData);
  }
}


continueSaving(data: any) {
  if (this.role?.toLowerCase() === 'patient') {
    this.userProfileService.updatePatientProfile(data).subscribe({
      next: () => {
        Object.assign(this.patientProfile, this.form.value);
        this.patientProfile.user.profileImage = this.previewImageUrl;

        this.successMessage = 'Profile updated successfully!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);

        this.editMode = false;
        this.form.disable();
      },
      error: (err) => {
        alert('Failed to update patient profile');
        console.error('Update failed', err);
        this.editMode = false;
        this.form.disable();
      }
    });
  } else if (this.role?.toLowerCase() === 'helper') {
    this.userProfileService.updateHelperProfile(data).subscribe({
      next: () => {
        Object.assign(this.helperProfile, this.form.value);
        this.helperProfile.user.profileImage = this.previewImageUrl;

        this.successMessage = 'Profile updated successfully!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);

        this.editMode = false;
        this.form.disable();
      },
      error: () => alert('Failed to update helper profile')
    });
  }
}

  // Withdrawal modal logic
  openWithdrawModal() {
    // Navigate to the withdrawal payment page in the provider section
    this.router.navigate(['/provider/withdrawal-payment']);
  }
  closeWithdrawModal() {
    this.showWithdrawModal = false;
    this.withdrawError = '';
    this.withdrawSuccess = '';
  }
  handleWithdraw() {
    if (!this.helperProfile || typeof this.helperProfile.balance !== 'number') {
      this.withdrawError = 'Balance not available.';
      return;
    }
    if (this.withdrawAmount < 200) {
      this.withdrawError = 'Minimum withdrawal amount is 200 EGP.';
      return;
    }
    if (this.withdrawAmount > this.helperProfile.balance) {
      this.withdrawError = 'Insufficient balance.';
      return;
    }
    if (!this.bankAccountNumber || !this.bankName || !this.accountHolderName) {
      this.withdrawError = 'Please fill in all bank account details.';
      return;
    }
    this.isWithdrawing = true;
    this.userProfileService.withdraw(
      this.withdrawAmount, 
      this.bankAccountNumber, 
      this.bankName, 
      this.accountHolderName
    ).subscribe({
      next: (res) => {
        this.withdrawSuccess = 'Withdrawal processed successfully!';
        this.withdrawError = '';
        // Update balance locally
        if (this.helperProfile) {
          this.helperProfile.balance = (this.helperProfile.balance || 0) - this.withdrawAmount;
        }
        setTimeout(() => {
          this.closeWithdrawModal();
        }, 2000);
      },
      error: (err) => {
        this.withdrawError = err?.error?.message || 'Withdrawal failed.';
        this.withdrawSuccess = '';
      },
      complete: () => {
        this.isWithdrawing = false;
      }
    });
  }

}
