import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-mainhomenavbar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './mainhomenavbar.component.html',
  styleUrl: './mainhomenavbar.component.css'
})
export class MainhomenavbarComponent {
scrollTo(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
}
