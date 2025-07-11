import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDisabledData } from 'core/interfaces/idisabled-data';
import { Iserviceoffer } from 'core/interfaces/iserviceoffer';
import { DisabledDataService } from 'core/services/disabled-data.service';
import { HelperoffersService } from 'core/services/helperoffers.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-helper-explore-offers',
  imports: [CommonModule, FormsModule],
  templateUrl: './helper-explore-offers.component.html',
  styleUrl: './helper-explore-offers.component.css',
})
export class HelperExploreOffersComponent implements OnInit {
  services: Iserviceoffer[] = [];
  offersWithDisabledData: { offer: Iserviceoffer; disabled: IDisabledData }[] = [];
  filteredOffers: { offer: Iserviceoffer; disabled: IDisabledData }[] = [];
  paginatedOffers: { offer: Iserviceoffer; disabled: IDisabledData }[] = [];

  // Filtering
  searchText: string = '';
  selectedAddress: string = '';
  selectedBudget: number | null = null;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 4;

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
              const combined = { offer: offer, disabled: disabledData };
              this.offersWithDisabledData.push(combined);
              this.applyFilters();
            },
            error: (err) => {
              console.error(`Error getting disabled data for ID ${offer.disabledId}`, err);
            },
          });
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  get totalPages(): number[] {
    const total = Math.ceil(this.filteredOffers.length / this.itemsPerPage);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedOffers = this.filteredOffers.slice(start, end);
  }

  applyFilters(): void {
    this.filteredOffers = this.offersWithDisabledData.filter((item) => {
      const matchSearch =
        this.searchText === '' ||
        item.offer.description.toLowerCase().includes(this.searchText.toLowerCase());

      const matchAddress =
        this.selectedAddress === '' || item.disabled.address === this.selectedAddress;

      const matchBudget =
        this.selectedBudget === null || item.offer.budget <= this.selectedBudget;

      return matchSearch && matchAddress && matchBudget;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  get uniqueAddresses(): string[] {
    return [...new Set(this.offersWithDisabledData.map((x) => x.disabled.address))];
  }

  gotoOfferRequests(id: number): void {
    this._RouterService.navigate(['/provider/applyoffer', id]);
  }

  trackByOfferId(index: number, item: any) {
    return item.offer.id;
  }
}
