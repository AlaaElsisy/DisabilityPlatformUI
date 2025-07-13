import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DisabledRequestService } from '../../app/services/disabled-request.service';
import { DisabledRequest } from '../../app/models/disabled-request.model';
import { UserProfileService } from '../../app/services/user-profile.service';
import { SignalrService } from '../../app/services/signalr.service';
import { UserProfileService as PatientProfileService } from '../../app/services/patient-profile.service';

@Component({
  selector: 'app-add-patient-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-patient-request.component.html',
  styleUrls: ['./add-patient-request.component.css']
})
export class AddPatientRequestComponent implements OnInit, OnChanges {
  @Input() helperServiceId?: number;
  @Input() helperName?: string;
  @Input() helperId?: number;
  @Input() userId?: string;
  @Input() service?: string;

  requestForm!: FormGroup;
  submitted = false;
  loading = false;
  successMsg = '';
  errorMsg = '';
  disabledId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private disabledRequestService: DisabledRequestService,
    private userProfileService: UserProfileService,
    private signalrService: SignalrService,
    private patientProfileService: PatientProfileService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (!this.helperServiceId && params['helperServiceId']) {
        this.helperServiceId = +params['helperServiceId'];
      }
      if (!this.helperName && params['helperName']) {
        this.helperName = params['helperName'];
      }
      if (!this.helperId && params['helperId']) {
        this.helperId = +params['helperId'];
      }

      if (!this.userId && params['userId']) {
        this.userId = params['userId'];
      }

      if (!this.service && params['service']) {
        this.service = params['service'];
      }
      this.patchInputs();
    });
    this.requestForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(10)]],
      start: ['', Validators.required],
      end: ['', Validators.required],
      price: [null, Validators.required],
    });
    this.patchInputs();
    this.userProfileService.getDisabledIdForCurrentUser().subscribe({
      next: (id) => this.disabledId = id,
      error: () => this.errorMsg = 'Could not fetch your Disabled ID.'
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['helperServiceId'] || changes['helperName']) {
      this.patchInputs();
    }
  }

  patchInputs() {
  }

  get f() { return this.requestForm.controls; }

  isDateTimeInvalid(): boolean {
    const start = this.requestForm.value.start;
    const end = this.requestForm.value.end;
    if (!start || !end) return false;
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    return startDate <= now || endDate <= now || endDate <= startDate;
  }

  onSubmit() {
    this.submitted = true;
    this.successMsg = '';
    this.errorMsg = '';
    if (this.requestForm.invalid || this.isDateTimeInvalid()) return;
    this.loading = true;
    if (!this.disabledId) {
      this.errorMsg = 'Could not determine your Disabled ID. Please log in again.';
      this.loading = false;
      return;
    }
    const request: DisabledRequest = {
      id: undefined,
      description: this.requestForm.value.description,
      requestDate: new Date().toISOString(),
      start: this.requestForm.value.start,
      end: this.requestForm.value.end,
      price: this.requestForm.value.price,
      disabledId: this.disabledId,
      helperServiceId: this.helperServiceId!,
    };
    this.disabledRequestService.createRequest(request).subscribe({
      next: (res) => {
        this.successMsg = 'Request submitted successfully!';
        this.requestForm.reset();
        this.submitted = false;
        this.loading = false;
        // Notify the helper
        this.patientProfileService.getMyDisabledProfile().subscribe({
          next: (profile) => {
            const patientName = profile.user.fullName;
            console.log(this.userId);
            if (this.userId) {
              const message = `${patientName} has added a request to your service(${this.service}).`;
              this.signalrService.sendNotificationToClient(message, this.userId.toString());
            }
          }
        });
      },
      error: (err) => {
        this.errorMsg = 'Failed to submit request. Please try again.';
        this.loading = false;
      }
    });
  }
} 