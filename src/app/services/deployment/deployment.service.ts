import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Subject } from 'rxjs';

export const environment = {
  production: false,
  SOCKET_ENDPOINT: 'http://localhost:8080'
};
@Injectable({
  providedIn: 'root'
})
export class DeploymentService {
  public progressUpdate: Subject<any> = new Subject<any>();

  socket: SocketIOClient.Socket;
  constructor() {


  }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.on('deploymentUpdate', (data: string) => {
      this.progressUpdate.next(data);
      // console.log(data);
    });
  }
}
