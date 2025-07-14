import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { Notification } from '../../app/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private userId: string = '';
  private isStarted: boolean = false;

constructor(private toastr: ToastrService) {}

  startConnection(userId: string) {
    if (this.isStarted) return;

    this.userId = userId;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7037/notificationHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this.isStarted = true;
        this.saveUserConnection(userId);
      })
      .catch(err => console.error('Error while starting SignalR connection: ', err));

      this.listenToNotifications();
  }

  private listenToNotifications() {
    this.hubConnection.on('ReceivedNotification', (notification: Notification) => {
      console.log('Notification received:', notification);
      this.toastr.info(notification.message, 'Notification');
    });

   this.hubConnection.on('ReceivedPersonalNotification', (message: string, userId: string) => {
  console.log(`Notification message:`, message);
  this.toastr.info(message, 'Personal Notification');
});

  }

  onNotification(callback: (message: string) => void) {
    this.hubConnection.on('ReceivedNotification', callback);
  }

  onPersonalNotification(callback: (message: string, userId: string) => void) {
    this.hubConnection.on('ReceivedPersonalNotification', callback);
  }

  sendNotificationToAll(message: string): Promise<void> {
    if (this.hubConnection?.state !== signalR.HubConnectionState.Connected) {
      return Promise.reject('SignalR not connected');
    }
    return this.hubConnection.invoke('SendNotificationToAll', message);
  }

  sendNotificationToClient(message: string, userId: string): Promise<void> {
    if (this.hubConnection?.state !== signalR.HubConnectionState.Connected) {
      return Promise.reject('SignalR not connected');
    }
    return this.hubConnection.invoke('SendNotificationToClient', message, userId);
  }

  saveUserConnection(userId: string) {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('SaveUserConnection', userId)
        .then(() => console.log("User connection saved"))
        .catch(err => console.error("Error saving user connection", err));
    }
  }

  isConnected(): boolean {
    return this.hubConnection?.state === signalR.HubConnectionState.Connected;
  }
}