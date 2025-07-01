import { Component } from '@angular/core';
import { routes } from '../../app/app.routes';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-providernavbar',
  
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './providernavbar.component.html',
  styleUrl: './providernavbar.component.css'
})
export class ProvidernavbarComponent {
scrollTo(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
}
