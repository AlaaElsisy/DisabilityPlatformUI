import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainhomenavbarComponent } from "../components/mainhomenavbar/mainhomenavbar.component";



@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet, MainhomenavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'EaseAid';
}



