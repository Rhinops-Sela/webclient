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
  domainsToInstall: IDomain[];
  activeDomain: IDomain;
  activeDomainName: string;
  bufferValue = 0;
  constructor(private deploymentService: DeploymentService, public dialogRef: MatDialogRef<DeploymentProgressModalComponent>, private backendService: BackendService, @Inject(MAT_DIALOG_DATA) public data: IDeploymentInfo) { }

  ngOnInit(): void {
    try {
      if (this.data) {
        this.domainsToInstall = this.data.domains;
        this.activeDomainName = this.domainsToInstall[0].name;

        this.activeDomain = this.domainsToInstall[0];
        this.activeDomain.logs = [];
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

  public changeDomain(domainName) {
    if (this.activeDomainName !== domainName) {
      this.activeDomainName = domainName;
      this.activeDomain = this.domainsToInstall.find((domain) => domain.name === domainName);
    }

  }

  private onDeploymentMessage(deploymentMessage: IDeploymentMessage) {
    this.message = deploymentMessage.message;
    if (this.activeDomainName !== deploymentMessage.domainName) {
      this.activeDomain = this.domainsToInstall.find((domain) => domain.name === deploymentMessage.domainName);
      this.activeDomainName = deploymentMessage.domainName;
      if (!this.activeDomain.logs) {
        this.activeDomain.logs = [];
      }
    }

    if (deploymentMessage.error) {
      const line: ILogLine = {
        color: 'red',
        time: new Date().toLocaleString(),
        content: deploymentMessage.log
      };

      this.activeDomain.logs.push(line);
    } else {
      const line: ILogLine = {
        color: 'white',
        time: new Date().toLocaleString(),
        content: deploymentMessage.log
      };
      this.activeDomain.logs.push(line);
    }
    if (deploymentMessage.progress) {
      this.bufferValue = Math.round((deploymentMessage.progress.curentPage / deploymentMessage.progress.totalPages) * 100);
    } else {
      console.log('missing progress info');
    }


  }



}
