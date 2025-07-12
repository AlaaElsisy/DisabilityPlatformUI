import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HelperservicesService } from '../../core/services/helperservices.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GetloggineduserDataService } from 'core/services/getloggineduser-data.service';
import { ServiceCategory, ServiceCategoryService } from '@services/service-category.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-helperaddservice',
  standalone: true,
  templateUrl: './helperaddservice.component.html',
  styleUrl: './helperaddservice.component.css',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]

})
export class HelperaddserviceComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private readonly _helperservicesService = inject(HelperservicesService);
  private readonly _getLoggingHelper = inject(GetloggineduserDataService);
  private readonly _toster=inject(ToastrService)

  isloading: boolean = false;
  isEditMode: boolean = false;
  serviceId: number | null = null;
   userid!:number
   Allcategories!:ServiceCategory[]
    private readonly _ServiceCategoryService=inject(ServiceCategoryService)
  addHelperService: FormGroup = new FormGroup({
    description: new FormControl(''),
    pricePerHour: new FormControl(''),
    availableDateFrom: new FormControl(''),
    availableDateTo: new FormControl(''),
    helperId: new FormControl(null),
   serviceCategoryId: new FormControl<number | null>(null),

    status: new FormControl('0'),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this._getLoggingHelper.getuserData().subscribe({
      next:(value)=> {
          console.log(value)
          this.userid=value.id;
           this.addHelperService.patchValue({ helperId: this.userid });
          console.log(this.userid)
          

      },
      error(err) {
          console.log(`erorrr`)

      },

    })
     
    //All categories -----------
  this._ServiceCategoryService.getServiceCategories().subscribe({
      next:(value) =>{
          console.log(value)
          this.Allcategories=value;
          console.log( this.Allcategories)
              },
    })

    //----------------
   
    if (id) {
      this.isEditMode = true;
      this.serviceId = +id;
    
       

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      this._helperservicesService.getServiceById(this.serviceId, headers).subscribe({
        next: (service) => {
          this.addHelperService.patchValue(service);
          
        }
        ,
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

    const data = {
      id: this.serviceId, 
      ...this.addHelperService.value
    };

    if (this.isEditMode && this.serviceId) {
      this._helperservicesService.updateService(this.serviceId, data, headers).subscribe({
        next: (res) => {
          this.isloading = false;
           this._toster.success('service updated successfully')
          this.router.navigate(['/provider/services']);
          console.log('Service updated:', res);
        },
        error: (err) => {
          this.isloading = false;
             this._toster.error(' cannot  update this service ')
          console.error('Update error:', err);
        }
      });
    } else {
      this._helperservicesService.addhelperservice(data, headers).subscribe({
        next: (res) => {
          this.isloading = false;
          this._toster.success('service Added successfully')
          this.router.navigate(['/provider/services']);
          console.log('Service added:', res);
        },
        error: (err) => {
          this.isloading = false;
           this._toster.error(' cannot add this service ')
          console.error('Add error:', err);
        }
      });
    }
  }
}
