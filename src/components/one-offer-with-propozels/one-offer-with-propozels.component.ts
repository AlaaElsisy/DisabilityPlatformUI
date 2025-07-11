import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IofferDetails } from 'core/interfaces/ioffer-details';
import { IDisabledData } from 'core/interfaces/idisabled-data';
import { GetofferbyidService } from 'core/services/getofferbyid.service';
import { DisabledDataService } from 'core/services/disabled-data.service';
import { IofferRequest } from 'core/interfaces/ioffer-request';

@Component({
  selector: 'app-one-offer-with-propozels',
  templateUrl: './one-offer-with-propozels.component.html',
  styleUrls: ['./one-offer-with-propozels.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class OneOfferWithPropozelsComponent implements OnInit {
  private readonly ActivatedRoute = inject(ActivatedRoute);
  private readonly _Route = inject(Router);
  private readonly _getOfferByIdService = inject(GetofferbyidService);
  private readonly _disabledData = inject(DisabledDataService);
  private readonly cd = inject(ChangeDetectorRef);

  Requests: IofferRequest[] = [];
  RequestWithProviderData: { Request: IofferRequest; providerData: IDisabledData }[] = [];
  filteredRequests: { Request: IofferRequest; providerData: IDisabledData }[] = [];
  offersWithDisabledData: { offer: IofferDetails; disabled: IDisabledData }[] = [];

  offerId: number = 0;
  totalpropozel!: number;

  // Filtering
  filters = {
    searchTerm: '',
    status: '',
    minPrice: null as number | null,
    maxPrice: null as number | null
  };

  statusOptions: string[] = ['Pending', 'Accepted', 'Rejected', 'Cancelled'];

  // Pagination
  page: number = 1;
  pageSize: number = 3;
  totalPages: number = 0;

  ngOnInit(): void {
    this.ActivatedRoute.paramMap.subscribe({
      next: (parameters) => {
        const idParam = parameters.get('id');
        if (idParam !== null) {
          this.offerId = +idParam;
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

          this._getOfferByIdService.getofferById(this.offerId, headers).subscribe({
            next: (offer: IofferDetails) => {
              this._disabledData.getDisabledDate(offer.disabledId).subscribe({
                next: (disabled: IDisabledData) => {
                  this.offersWithDisabledData.push({ offer, disabled });

                  this._getOfferByIdService.getOfferRequests(this.offerId, headers).subscribe({
                    next: (requests) => {
                      this.totalpropozel = requests.totalCount;
                      this.Requests = requests.items;

                      requests.items.forEach((request: IofferRequest) => {
                        this._disabledData.getHelperData(request.helperId).subscribe({
                          next: (providerData: IDisabledData) => {
                            this.RequestWithProviderData.push({ Request: request, providerData });
                            this.filterRequests();
                            this.cd.detectChanges();
                          }
                        });
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  }

  filterRequests(): void {
    const term = this.filters.searchTerm.toLowerCase();

    this.filteredRequests = this.RequestWithProviderData.filter(({ Request, providerData }) => {
      const matchesSearch =
        providerData.fullName.toLowerCase().includes(term) ||
        providerData.zone.toLowerCase().includes(term) ||
        providerData.address.toLowerCase().includes(term);

      const matchesStatus = this.filters.status === '' || Request.status.toLowerCase() === this.filters.status.toLowerCase();
      const matchesMinPrice = this.filters.minPrice === null || Request.totalPrice >= this.filters.minPrice;
      const matchesMaxPrice = this.filters.maxPrice === null || Request.totalPrice <= this.filters.maxPrice;

      return matchesSearch && matchesStatus && matchesMinPrice && matchesMaxPrice;
    });

    this.totalPages = Math.ceil(this.filteredRequests.length / this.pageSize);
    this.page = 1;
  }

  get paginatedRequests() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredRequests.slice(start, start + this.pageSize);
  }

  changePage(step: number): void {
    this.page += step;
    if (this.page < 1) this.page = 1;
    if (this.page > this.totalPages) this.page = this.totalPages;
  }

  Apply(): void {
    this._Route.navigate([`/provider/AddRequest/${this.offerId}`]);
  }

  gotoproviderProfile(userId: number): void {
    this._Route.navigate(['/provider/userprofile'], {
      queryParams: { userId, role: 'helper' }
    });
  }

  gotoPatientProfile(userId: number): void {
    this._Route.navigate(['/user-view-profile'], {
      queryParams: { userId, role: 'patient' }
    });
  }
}
