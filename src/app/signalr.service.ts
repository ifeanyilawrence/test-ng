import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: any;

  private hubConnection: signalR.HubConnection;

    public startConnection = () => {
      // this.hubConnection = new signalR.HubConnectionBuilder().withUrl('http://204.2.62.35/pawa2u/signalr').build();
      this.hubConnection = new signalR.HubConnectionBuilder()
          .configureLogging(signalR.LogLevel.Debug)
          .withUrl('http://204.2.62.35/pawa2u/signalr', {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
          })
          .build();

      this.hubConnection
        .start()
        .then(() => console.log('Connection started!'))
        .catch(err => console.log('Error while starting connection: ' + err));
    }

    public addOrderResponseListener = () => {
      this.hubConnection.on('OrderResponse', (data) => {
        this.data = data;
        console.log(data);
      });
    }
}
