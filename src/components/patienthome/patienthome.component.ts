import { Component, AfterViewInit, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';import { RouterModule } from '@angular/router';
import { ServiceCategoriesComponent } from '../service-categories/service-categories.component';
import { CommonModule } from '@angular/common';
import { ServiceCategory, ServiceCategoryService } from '@services/service-category.service';

@Component({
  selector: 'app-patienthome',
  standalone: true,
  templateUrl: './patienthome.component.html',
  styleUrls: ['./patienthome.component.css'],
  imports: [CommonModule, RouterModule , ServiceCategoriesComponent],
  encapsulation: ViewEncapsulation.None, 
})

export class PatienthomeComponent implements AfterViewInit , OnInit{
  serviceCategories: ServiceCategory[] = [];
  constructor(private el: ElementRef , private serviceCategoryService: ServiceCategoryService) {}
  ngOnInit(): void {
    this.serviceCategoryService.getServiceCategories().subscribe(categories => {
      this.serviceCategories = categories;
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
}
