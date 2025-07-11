import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { SignalrService } from '@services/signalr.service';

@Component({
  selector: 'app-test',
  imports: [CommonModule,FormsModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestNotificationComponent implements OnInit {

  message: string = '';
  userId: string = '4a7e2d4e-4934-41ff-a0c3-ca654be021f2';
  receivedMessages: string[] = [];
  currentUserId: string = '';

  constructor(private signalrService: SignalrService) {}

  ngOnInit(): void {
    currentUserId = localStorage.getItem('userId') || '';
    this.signalrService.startConnection(currentUserId);


    var currentUserId =localStorage.getItem('userId')||'';
    this.signalrService.saveUserConnection(currentUserId);

    this.signalrService.onNotification((message: string) => {
      this.receivedMessages.push(`Broadcast: ${message}`);
    });

    this.signalrService.onPersonalNotification((message: string, userId: string) => {
      this.receivedMessages.push(`Private to ${userId}: ${message}`);
    });
  }

  sendToAll() {
    this.signalrService.sendNotificationToAll(this.message);
  }

  sendToUser() {
    this.signalrService.sendNotificationToClient(this.message, this.userId);
  }
}
