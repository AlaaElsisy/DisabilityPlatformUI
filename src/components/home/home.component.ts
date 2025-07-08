import { Component, AfterViewInit, ElementRef, ViewEncapsulation, inject } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { MainhomenavbarComponent } from "../mainhomenavbar/mainhomenavbar.component";
import { ServiceCategoriesComponent } from '../service-categories/service-categories.component';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [FooterComponent, RouterModule, MainhomenavbarComponent, ServiceCategoriesComponent],
  encapsulation: ViewEncapsulation.None, 
})
export class HomeComponent implements AfterViewInit {
  
   private readonly _Router=inject(Router)

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
 gotoLogin():void{
  this._Router.navigate(['/login'])
 }
  gotoRegister():void{
  this._Router.navigate(['/register'])
 }

}
