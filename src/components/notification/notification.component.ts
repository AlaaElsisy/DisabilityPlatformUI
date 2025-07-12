import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@services/notification.service';
import { Notification } from '../../app/models/notification.model';

@Component({
  selector: 'app-notification',
  imports: [CommonModule,DatePipe],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  userId = localStorage.getItem('userId') || '';

  constructor(private notificationService: NotificationService) {}

   ngOnInit(): void {
    const userId = this.userId;
    this.notificationService.getNotifications(userId).subscribe(data => {
      this.notifications = data.sort((a, b) => new Date(b.notificationDateTime).getTime() - new Date(a.notificationDateTime).getTime());
    });
  }
}
