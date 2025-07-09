import { Component } from '@angular/core';
import { MainhomenavbarComponent } from "../mainhomenavbar/mainhomenavbar.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-notfound',
  imports: [MainhomenavbarComponent, FooterComponent],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.css'
})
export class NotfoundComponent {

}
