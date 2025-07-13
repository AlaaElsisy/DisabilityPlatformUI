import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetloggineduserDataService } from 'core/services/getloggineduser-data.service';
import { HelperRequestsService } from 'core/services/helper-requests.service';
import { ToastrService } from 'ngx-toastr';
import { SignalrService } from '../../app/services/signalr.service';
import { DisabledOfferService } from '../../app/services/disabled-offer.service';
import { DisabledDataService } from 'core/services/disabled-data.service';

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
  private readonly _toster=inject(ToastrService)
  private readonly _signalrService = inject(SignalrService);
  private readonly _disabledOfferService = inject(DisabledOfferService);
  private readonly _disabledDataService = inject(DisabledDataService);

  offerId!: number;
  helperId!: number;
  addRequestForm!: FormGroup;
 test():void{
  this._HelperRequestsService.AddRequestToOffer(this.addRequestForm.value).subscribe({
    next:(res)=>{
       this._toster.success('request added successfully')
       this._disabledOfferService.getById(this.offerId).subscribe({
         next: (offer) => {
           const disabledId = offer.disabledId;
           const offerDescription = offer.description;
           this._disabledDataService.getDisabledDate(disabledId).subscribe({
             next: (disabledData) => {
               const patientUserId = disabledData.userId;
               // Fetch helper name
               this._getlogginedUser.getuserData().subscribe({
                 next: (helperProfile) => {
                   const helperName = helperProfile.user.fullName;
                   const message = `${helperName} has added a request to your offer: '${offerDescription}'.`;
                   this._signalrService.sendNotificationToClient(message, patientUserId);
                 }
               });
             }
           });
         }
       });
       this._router.navigate([`/provider/applyoffer/${this.offerId}`]);
          console.log('Request added succesfully:', res);
    },error:(err)=> {
         this._toster.error('cannot add your request')
    },
  })


 }
  ngOnInit(): void {
    this._ActivatedRouter.paramMap.subscribe({
      next: (parameters) => {
        const idParam = parameters.get('id');
        if (idParam !== null) {
          this.offerId = +idParam;

          this._getlogginedUser.getuserData().subscribe({
            next: (res) => {
              this.helperId = res.id;

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
