import { Component, ElementRef } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { MainhomenavbarComponent } from "../mainhomenavbar/mainhomenavbar.component";
import { ProvidernavbarComponent } from "../providernavbar/providernavbar.component";
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-providerhome',
  imports: [FooterComponent,RouterModule],
  templateUrl: './providerhome.component.html',
  styleUrl: './providerhome.component.css'
})
export class ProviderhomeComponent {
 constructor(private el:ElementRef) {}

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
