import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainhomenavbarComponent } from "../components/mainhomenavbar/mainhomenavbar.component";
import { AddPatientRequestComponent } from 'components/add-patient-request/add-patient-request.component';
import { SignalrService } from './services/signalr.service';
import { ChatbotComponent } from "components/chatbot/chatbot.component";


@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet, MainhomenavbarComponent, AddPatientRequestComponent, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'EaseAid';

  constructor(private signalrService: SignalrService) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.signalrService.startConnection(userId);
    }
  }
}



