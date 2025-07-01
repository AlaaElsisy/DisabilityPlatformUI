import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainhomenavbarComponent } from "../components/mainhomenavbar/mainhomenavbar.component";
import { AddPatientRequestComponent } from 'components/add-patient-request/add-patient-request.component';



@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet, MainhomenavbarComponent, AddPatientRequestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'EaseAid';
}



