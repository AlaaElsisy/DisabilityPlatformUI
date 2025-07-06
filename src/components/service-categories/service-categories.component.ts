import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServiceCategoryService, ServiceCategory } from '../../app/services/service-category.service';

@Component({
  selector: 'app-service-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service-categories.component.html',
  styleUrl: './service-categories.component.css'
})
export class ServiceCategoriesComponent implements OnInit {
  serviceCategories: ServiceCategory[] = [];

  constructor(private serviceCategoryService: ServiceCategoryService) {}

  ngOnInit(): void {
    this.serviceCategoryService.getServiceCategories().subscribe(categories => {
      this.serviceCategories = categories;
    });
  }
}
