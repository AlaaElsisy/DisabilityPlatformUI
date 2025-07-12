import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private userId: string = '';



  startConnection(userId: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7037/notificationHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
      console.log('SignalR connection started');
      this.saveUserConnection(userId);
    })
      .catch(err => console.error('Error while starting SignalR connection: ', err));
  }

  onNotification(callback: (message: string) => void) {
    this.hubConnection.on('ReceivedNotification', callback);
  }

  onPersonalNotification(callback: (message: string, userId: string) => void) {
    this.hubConnection.on('ReceivedPersonalNotification', callback);
  }

  sendNotificationToAll(message: string) {
    return this.hubConnection.invoke('SendNotificationToAll', message);
  }

  sendNotificationToClient(message: string, userId: string) {
    console.log(message);
    console.log(userId);
    return this.hubConnection.invoke('SendNotificationToClient', message, userId);
  }

 saveUserConnection(userId: string){
  if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
    this.hubConnection.invoke('SaveUserConnection', userId)
      .then(() => console.log("User connection saved"))
      .catch(err => console.error("Error saving user connection", err));
  } else {
    console.error("Connection not established yet");
  }
}
}
