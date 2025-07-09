import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HelperservicesService } from '../../core/services/helperservices.service';
import { Router } from '@angular/router';
import { Ihelperservices } from '../../core/interfaces/ihelperservices';
import { CommonModule } from '@angular/common';
import { GetloggineduserDataService } from 'core/services/getloggineduser-data.service';
import { ServiceCategoryService } from '@services/service-category.service';

@Component({
  standalone: true,
  selector: 'app-providerservices',
  templateUrl: './providerservices.component.html',
  styleUrl: './providerservices.component.css',
  imports: [ReactiveFormsModule, HttpClientModule,CommonModule]
})
export class ProviderservicesComponent implements OnInit {
   AllServices:Ihelperservices[] = [];
   Allcategories:[]=[];
  private router = inject(Router);
   userid!:number
    private readonly _getLoggingHelper = inject(GetloggineduserDataService);
  private readonly _helperservicesService = inject(HelperservicesService);
 
   addservice() {
    this.router.navigate(['/provider/helperaddservice']);
  }

 ngOnInit(): void {
  const token=localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this._getLoggingHelper.getuserData().subscribe({
      next:(value)=> {
          console.log(value)
          this.userid=value.id;
         
          console.log(this.userid)
          this._helperservicesService.gethelprservices(this.userid,headers).subscribe({
    next:(res)=>{
      console.log(res);
      this.AllServices = res;
    },
    error:(err)=>{
      console.log(err);
    }
  })

      },error:(err)=>{
      console.log(err)
      }})

  
  
 }

deleteService(id:number):void{
  const token=localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
  this._helperservicesService.helperDeleteservice(id,headers).subscribe({
    next:(res)=>{
      console.log('Service deleted successfully:', res);
      this.ngOnInit();
    },
    error:(err)=>{
      console.log(err);
    }
  })
}

editService(id: number): void {
  this.router.navigate(['/provider/helperaddservice', id]);
}
goTosericrPropozels(id:number):void{
  this.router.navigate(['/provider/orders',id])
}

  
}
