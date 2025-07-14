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
  pageNumber: number = 1;

  constructor(private notificationService: NotificationService) {}

   ngOnInit(): void {
    const userId = this.userId;
    this.notificationService.getNotifications(userId,this.pageNumber).subscribe(data => {
      this.notifications = data.sort((a, b) => new Date(b.notificationDateTime).getTime() - new Date(a.notificationDateTime).getTime());
    });

  }
     loadMore(): void {
      this.pageNumber++;
      this.notificationService.getNotifications(this.userId, this.pageNumber).subscribe(data => {
        this.notifications = [...this.notifications, ...data].sort((a, b) => new Date(b.notificationDateTime).getTime() - new Date(a.notificationDateTime).getTime());
      });
    }
}
