import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDisabledData } from 'core/interfaces/idisabled-data';
import { Iserviceoffer } from 'core/interfaces/iserviceoffer';
import { DisabledDataService } from 'core/services/disabled-data.service';
import { HelperoffersService } from 'core/services/helperoffers.service';

@Component({
  standalone: true,
  selector: 'app-helper-explore-offers',
  imports: [CommonModule],
  templateUrl: './helper-explore-offers.component.html',
  styleUrl: './helper-explore-offers.component.css'
})
export class HelperExploreOffersComponent implements OnInit {
  services: Iserviceoffer[] = [];

  offersWithDisabledData: {
    offer: Iserviceoffer;
    disabled: IDisabledData;
  }[] = [];

  private readonly _helperoffersServices = inject(HelperoffersService);
  private readonly _disabledData = inject(DisabledDataService);
  private readonly _RouterService = inject(Router);

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this._helperoffersServices.GetAlloffrers().subscribe({
      next: (res) => {
        this.services = res.items;

        res.items.forEach((offer: Iserviceoffer) => {
          this._disabledData.getDisabledDate(offer.disabledId).subscribe({
            next: (disabledData: IDisabledData) => {
              this.offersWithDisabledData.push({
                offer: offer,
                disabled: disabledData
              });
            },
            error: (err) => {
              console.error(`Error getting disabled data for ID ${offer.disabledId}`, err);
            }
          });
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  gotoOfferRequests(id: number): void {
    this._RouterService.navigate(['/provider/applyoffer', id]);
  }
}
