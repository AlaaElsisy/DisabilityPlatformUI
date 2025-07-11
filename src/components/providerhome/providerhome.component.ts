import { Component, AfterViewInit, ElementRef, ViewEncapsulation, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { MainhomenavbarComponent } from '../mainhomenavbar/mainhomenavbar.component';
import { ServiceCategoriesComponent } from '../service-categories/service-categories.component';
@Component({
  selector: 'app-providerhome',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
   encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    
   
    ServiceCategoriesComponent,
  
  ],
  templateUrl: './providerhome.component.html',
  styleUrl: './providerhome.component.css'
})
    
export class ProviderhomeComponent {
 

   private readonly _Router = inject(Router);

  constructor(private el: ElementRef) {}

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

  gotoLogin(): void {
    this._Router.navigate(['/login']);
  }

  gotoRegister(): void {
    this._Router.navigate(['/register']);
  }

}
