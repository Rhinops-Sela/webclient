import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Subject } from 'rxjs';
import config from '../../../assets/config.json';
@Injectable({
  providedIn: 'root',
})
export class DeploymentService {
  public progressUpdate: Subject<any> = new Subject<any>();
  deploymentIdentifier: string;
  socket: SocketIOClient.Socket;
  constructor() {}

  setupSocketConnection(deploymentIdentifier: string) {
    this.deploymentIdentifier = deploymentIdentifier;
    this.socket = io(config.socketUrl);
    this.socket.on(this.deploymentIdentifier, (data: string) => {
      this.progressUpdate.next(data);
    });
  }

  sendKillMessage() {
    this.socket.emit('kill', this.deploymentIdentifier);
  }

  closeSocket() {
    this.socket = this.socket.close();
  }
}
