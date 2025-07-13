import { Component } from '@angular/core';
import { ProvidernavbarComponent } from "../providernavbar/providernavbar.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";
import { ChatbotComponent } from "components/chatbot/chatbot.component";

@Component({
  selector: 'app-provider-layout',
  imports: [ProvidernavbarComponent, RouterOutlet, FooterComponent, ChatbotComponent],
  templateUrl: './provider-layout.component.html',
  styleUrl: './provider-layout.component.css'
})
export class ProviderLayoutComponent {

}
