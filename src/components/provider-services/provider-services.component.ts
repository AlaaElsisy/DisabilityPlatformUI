import { Component, OnInit, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProviderServicesService } from '../../app/services/provider-services.service';
import { ProviderService, ProviderServiceQuery, ProviderServicePagedResult } from '../../app/models/provider-service.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-provider-services',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './provider-services.component.html',
  styleUrl: './provider-services.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ProviderServicesComponent implements OnInit, AfterViewInit {
  services: ProviderService[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 3;
  searchWord = '';
  minBudget: number | null = null;
  maxBudget: number | null = null;
  loading = false;
  sortBy: string = '';
  serviceCategoryId: number | undefined;
  categoryMap: { [key: string]: number } = {
    'Medical Service': 1,
    'Delivery Service': 2,
    'Driver Service': 3,
    'Public Services': 4
  };

  constructor(private providerServicesService: ProviderServicesService, private el: ElementRef, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const categoryId = params.get('categoryId');
      const category = params.get('category');
      if (categoryId) {
        this.serviceCategoryId = +categoryId;
      } else if (category && this.categoryMap[category]) {
        this.serviceCategoryId = this.categoryMap[category];
      } else {
        this.serviceCategoryId = undefined;
      }
      this.fetchServices();
    });
  }

  ngAfterViewInit(): void {
    const sections = this.el.nativeElement.querySelectorAll('section');
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          entry.target.classList.remove('section-hidden');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    sections.forEach((section: Element) => {
      section.classList.add('section-hidden');
      observer.observe(section);
    });
  }

  fetchServices() {
    this.loading = true;
    const query: ProviderServiceQuery = {
      searchWord: this.searchWord,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      ...(this.minBudget !== null ? { minBudget: this.minBudget } : {}),
      ...(this.maxBudget !== null ? { maxBudget: this.maxBudget } : {}),
      ...(this.sortBy ? { sortBy: this.sortBy } : {}),
      ...(this.serviceCategoryId ? { serviceCategoryId: this.serviceCategoryId } : {})
    };
    this.providerServicesService.getPagedServices(query).subscribe({
      next: (result) => {
        console.log(result.items);
        this.services = result.items;
        this.totalCount = result.totalCount;
        this.loading = false;
      },
      error: () => {
        this.services = [];
        this.totalCount = 0;
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.pageNumber = 1;
    this.fetchServices();
  }

  onPageChange(page: number) {
    this.pageNumber = page;
    this.fetchServices();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get categoryName(): string | null {
    switch (this.serviceCategoryId) {
      case 1: return 'Medical Service';
      case 2: return 'Delivery Service';
      case 3: return 'Driver Service';
      case 4: return 'Public Services';
      default: return null;
    }
  }
}
