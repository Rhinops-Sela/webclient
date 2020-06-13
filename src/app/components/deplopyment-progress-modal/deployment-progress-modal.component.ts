import { IDomain } from './../../interfaces/IDomain';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeploymentService } from 'src/app/services/deployment/deployment.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { IDeploymentInfo } from 'src/app/interfaces/IDeploymentInfo';
import { IDeploymentMessage } from 'src/app/interfaces/IDeploymentMessage';
import { ILogLine } from 'src/app/interfaces/ILogLine';

@Component({
  selector: 'app-deployment-progress',
  templateUrl: './deployment-progress-modal.component.html',
  styleUrls: ['./deployment-progress-modal.component.scss']
})
export class DeploymentProgressModalComponent implements OnInit {
  message: string;
  log: ILogLine[] = [];
  domainsToInstall: IDomain[];
  activeDomain: IDomain;
  bufferValue = 0;
  constructor(private deploymentService: DeploymentService, public dialogRef: MatDialogRef<DeploymentProgressModalComponent>, private backendService: BackendService, @Inject(MAT_DIALOG_DATA) public data: IDeploymentInfo) { }

  ngOnInit(): void {
    try {
      if (this.data) {
        this.domainsToInstall = this.data.domains;
        this.activeDomain = this.domainsToInstall[0];
        if (!this.data.deploymentIdentifier) {
          this.backendService.startDeployment(this.data.domains).then((deploymentIdentifier) => {
            this.deploymentService.setupSocketConnection(deploymentIdentifier);
          });
        } else {
          this.deploymentService.setupSocketConnection(this.data.deploymentIdentifier);
        }
      }
    } catch (error) {
      console.log(error);
    }
    this.message = 'Warming up...';
    this.deploymentService.progressUpdate.subscribe((message: IDeploymentMessage) => {
      console.log('message: ', message);
      this.onDeploymentMessage(message);
    });
  }

  private onDeploymentMessage(deploymentMessage: IDeploymentMessage) {
    this.message = deploymentMessage.message;
    if (deploymentMessage.error) {
      const line: ILogLine = {
        color: 'red',
        time: new Date().toLocaleString(),
        content: deploymentMessage.log
      };
      this.log.push(line);
    } else {
      const line: ILogLine = {
        color: 'white',
        time: new Date().toLocaleString(),
        content: deploymentMessage.log
      };
      this.log.push(line);
    }
    if (deploymentMessage.progress) {
      this.bufferValue = Math.round((deploymentMessage.progress.curentPage / deploymentMessage.progress.totalPages) * 100);
    } else {
      console.log('missing progress info');
    }


  }



}
