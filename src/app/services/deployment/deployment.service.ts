import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Subject } from 'rxjs';
import config from '../../../assets/config.json';
@Injectable({
  providedIn: 'root'
})
export class DeploymentService {
  public progressUpdate: Subject<any> = new Subject<any>();

  socket: SocketIOClient.Socket;
  constructor() {}

  setupSocketConnection(deploymentIdentifier: string) {
    this.socket = io(config.socketUrl);
    this.socket.on(deploymentIdentifier, (data: string) => {
      console.log('messeage: ', data);
      this.progressUpdate.next(data);
    });
  }

  closeSocket() {
    this.socket = this.socket.close();
  }
}
