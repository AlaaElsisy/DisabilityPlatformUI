import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetloggineduserDataService } from 'core/services/getloggineduser-data.service';
import { HelperRequestsService } from 'core/services/helper-requests.service';

@Component({
  selector: 'app-helper-add-request-to-offer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './helper-add-request-to-offer.component.html',
  styleUrl: './helper-add-request-to-offer.component.css'
})
export class HelperAddRequestToOfferComponent implements OnInit {
  private readonly _ActivatedRouter = inject(ActivatedRoute);
  private readonly _router=inject(Router)
  private readonly _getlogginedUser = inject(GetloggineduserDataService);
  private readonly _HelperRequestsService = inject(HelperRequestsService);

  offerId!: number;
  helperId!: number;
  addRequestForm!: FormGroup;
 test():void{
  console.log(this.addRequestForm.value)
  this._HelperRequestsService.AddRequestToOffer(this.addRequestForm.value).subscribe({
    next:(res)=>{
       this._router.navigate([`/provider/applyoffer/${this.offerId}`]);
          console.log('Request added succesfully:', res);
    }
  })


 }
  ngOnInit(): void {
    this._ActivatedRouter.paramMap.subscribe({
      next: (parameters) => {
        const idParam = parameters.get('id');
        if (idParam !== null) {
          this.offerId = +idParam;
          console.log('Offer ID:', this.offerId);

          this._getlogginedUser.getuserData().subscribe({
            next: (res) => {
              this.helperId = res.id;
              console.log('Helper ID:', this.helperId);

            
              this.addRequestForm = new FormGroup({
                applicationDate: new FormControl(new Date().toISOString()),
                status: new FormControl('Pending'),
                message: new FormControl('', Validators.required),
                totalPrice: new FormControl('', [Validators.required, Validators.min(1)]),
                helperId: new FormControl(this.helperId),
                disabledOfferId: new FormControl(this.offerId)
              });
            },
            error: (err) => {
              console.error('Error fetching logged-in user data:', err);
            }
          });
        }
      }
    });
  }
}
