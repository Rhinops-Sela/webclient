import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeploymentService } from 'src/app/services/deployment/deployment.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { IDeploymentInfo } from 'src/app/interfaces/IDeploymentInfo';
import { IDeploymentMessage } from 'src/app/interfaces/IDeploymentMessage';
import { ILogLine } from 'src/app/interfaces/ILogLine';
import { IPage } from 'src/app/interfaces/IPage';

@Component({
  selector: 'app-deployment-progress',
  templateUrl: './deployment-progress-modal.component.html',
  styleUrls: ['./deployment-progress-modal.component.scss'],
})
export class DeploymentProgressModalComponent implements OnInit {
  message: string;
  pagesToInstall: IPage[];
  activePage: IPage;
  bufferValue = 0;
  constructor(
    private deploymentService: DeploymentService,
    public dialogRef: MatDialogRef<DeploymentProgressModalComponent>,
    private backendService: BackendService,
    @Inject(MAT_DIALOG_DATA) public data: IDeploymentInfo
  ) {}

  ngOnInit(): void {
    try {
      this.pagesToInstall = [];
      if (this.data) {
        for (const domain of this.data.domains) {
          for (const page of domain.pages) {
            this.pagesToInstall.push(page);
          }
        }
        // this.activeDomainName = this.domainsToInstall[0].name;

        this.activePage = this.pagesToInstall[0];
        this.activePage.logs = [];
        if (!this.data.deploymentIdentifier) {
          this.backendService
            .startDeployment(this.data.domains)
            .then((deploymentIdentifier) => {
              this.deploymentService.setupSocketConnection(
                deploymentIdentifier
              );
              this.message = 'Warming up...';
              this.deploymentService.progressUpdate.subscribe(
                (message: IDeploymentMessage) => {
                  this.onDeploymentMessage(message);
                }
              );
            });
        } else {
          this.deploymentService.setupSocketConnection(
            this.data.deploymentIdentifier
          );
          this.message = 'Warming up...';
          this.deploymentService.progressUpdate.subscribe(
            (message: IDeploymentMessage) => {
              this.onDeploymentMessage(message);
            }
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  public changeDomain(pageName: string) {
    if (this.activePage.name !== pageName) {
      this.activePage = this.pagesToInstall.find(
        (page) => page.name === pageName
      );
    }
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  private async onDeploymentMessage(deploymentMessage: IDeploymentMessage) {
    console.log('message: ', deploymentMessage);
    this.message = deploymentMessage.message;
    if (this.activePage.name !== deploymentMessage.pageName) {
      await this.delay(100);
      this.activePage = this.pagesToInstall.find(
        (domain) => domain.name === deploymentMessage.pageName
      );
      if (deploymentMessage.pageName) {
        this.activePage.name = deploymentMessage.pageName;
      }
      if (!this.activePage.logs) {
        this.activePage.logs = [];
      }
    }
    if (deploymentMessage.error) {
      this.activePage.icon = 'clear';
    } else if (this.activePage.icon !== 'clear' && deploymentMessage.final) {
      this.activePage.icon = 'done';
    }

    if (deploymentMessage.error) {
      const line: ILogLine = {
        color: 'red',
        time: new Date().toLocaleString(),
        content: deploymentMessage.log,
      };

      this.activePage.logs.push(line);
    } else {
      const line: ILogLine = {
        color: '#f2f3f4',
        time: new Date().toLocaleString(),
        content: deploymentMessage.log,
      };
      this.activePage.logs.push(line);
    }
    if (deploymentMessage.progress) {
      this.bufferValue = Math.round(
        (deploymentMessage.progress.curentPage /
          deploymentMessage.progress.totalPages) *
          100
      );
    } else {
      console.log('missing progress info');
    }
  }
}
