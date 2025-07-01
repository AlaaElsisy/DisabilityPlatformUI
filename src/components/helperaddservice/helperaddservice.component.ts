import { Component } from '@angular/core';
import {  inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HelperservicesService } from '../../core/services/helperservices.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-helperaddservice',
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './helperaddservice.component.html',
  styleUrl: './helperaddservice.component.css'
})
export class HelperaddserviceComponent {
  private route = inject(ActivatedRoute);
    private router = inject(Router);
    isEditMode: boolean = false;
serviceId: number | null = null;

 private readonly _helperservicesService = inject(HelperservicesService);
    isloading: boolean = false;
  addHelperService: FormGroup = new FormGroup({
    description: new FormControl(''),
    pricePerHour: new FormControl(''),
    availableDateFrom: new FormControl(''),
    availableDateTo: new FormControl(''),
    helperId: new FormControl(''),
    serviceCategoryId: new FormControl(''),
  });
ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');

  if (id) {
    this.isEditMode = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this._helperservicesService.getServiceById(+id, headers).subscribe({
      next: (service) => {
        this.addHelperService.patchValue(service);
      },
      error: (err) => {
        console.error('Failed to fetch service data:', err);
      }
    });
  }
}


  test(): void {
  this.isloading = true;
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  const data = this.addHelperService.value;

  if (this.isEditMode && this.serviceId) {
    this._helperservicesService.updateService(this.serviceId, data, headers).subscribe({
      next: (res) => {
        this.isloading = false;
        this.router.navigate(['/provider/services']);
        console.log('Service updated:', res);
      },
      error: (err) => {
        this.isloading = false;
        console.error('Update error:', err);
      }
    });
  } else {
    this._helperservicesService.addhelperservice(data, headers).subscribe({
      next: (res) => {
        this.isloading = false;
        this.router.navigate(['/provider/services']);
        console.log('Service added:', res);
      },
      error: (err) => {
        this.isloading = false;
        console.error('Add error:', err);
      }
    });
  }
}

}
