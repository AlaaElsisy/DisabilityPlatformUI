import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

import { IofferDetails } from 'core/interfaces/ioffer-details';
import { IDisabledData } from 'core/interfaces/idisabled-data';
import { GetofferbyidService } from 'core/services/getofferbyid.service';
import { DisabledDataService } from 'core/services/disabled-data.service';
import { CommonModule } from '@angular/common';
import { IofferRequest } from 'core/interfaces/ioffer-request';

@Component({
  selector: 'app-one-offer-with-propozels',
  templateUrl: './one-offer-with-propozels.component.html',
  styleUrls: ['./one-offer-with-propozels.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class OneOfferWithPropozelsComponent implements OnInit {

  private readonly ActivatedRoute = inject(ActivatedRoute);
  private readonly _Route = inject(Router);
  private readonly _getOfferByIdService = inject(GetofferbyidService);
  private readonly _disabledData = inject(DisabledDataService);
private readonly cd = inject(ChangeDetectorRef);

  Requests: IofferRequest[] = [];
  offerId: number = 0;
  totalpropozel!:number

  offersWithDisabledData: {
    offer: IofferDetails;
    disabled: IDisabledData;
  }[] = [];

  RequestWithProviderData: {
    Request: IofferRequest;
    providerData: IDisabledData;
  }[] = [];

  ngOnInit(): void {
    this.ActivatedRoute.paramMap.subscribe({
      next: (parameters) => {
        const idParam = parameters.get('id');

        if (idParam !== null) {
          this.offerId = +idParam;
          console.log("Offer ID:", this.offerId);

          const token = localStorage.getItem('token');
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
          });

        
          this._getOfferByIdService.getofferById(this.offerId, headers).subscribe({
            next: (offer: IofferDetails) => {
              console.log('Offer:', offer);

              // Get Disabled User Data
              this._disabledData.getDisabledDate(offer.disabledId).subscribe({
                next: (disabled: IDisabledData) => {
                  console.log('Disabled data:', disabled);

                  this.offersWithDisabledData.push({
                    offer: offer,
                    disabled: disabled,
                  });

                  // Get Requests to this Offer
                  this._getOfferByIdService.getOfferRequests(this.offerId, headers).subscribe({
                    next: (requests) => {
                      console.log('Offer Requests:', requests);
              this.totalpropozel=    requests.totalCount
                      this.Requests = requests.items;
                     // this.totalpropozel=requests;

                      // Get provider (helper) data for each request
                      this.Requests.forEach((request: IofferRequest) => {
                        console.log(`provider id `+  request.helperId)
                        this._disabledData.getHelperData(request.helperId).subscribe({
                          next: (providerData: any) => {
                            this.RequestWithProviderData.push({
                              Request: request,
                              providerData: providerData

                             
                              
                            });
                            this.cd.detectChanges();
                          },
                          error: (err) => {
                            console.error(`Error getting provider data for ID ${request.helperId}`, err);
                          }
                        });
                      });
                    },
                    error: (err) => {
                      console.error('Error fetching offer requests:', err);
                    }
                  });

                },
                error: (err) => {
                  console.error(`Error getting disabled data for ID ${offer.disabledId}`, err);
                }
              });
            },
            error: (err) => {
              console.error('Error getting offer by ID', err);
            }
          });
        }
      }
    });
  }
   Apply():void{
    this._Route.navigate([`/provider/AddRequest/${this.offerId}`])
           }
}
