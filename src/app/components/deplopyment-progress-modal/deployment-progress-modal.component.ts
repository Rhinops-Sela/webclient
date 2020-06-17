import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeploymentService } from 'src/app/services/deployment/deployment.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { IDeploymentInfo } from 'src/app/interfaces/IDeploymentInfo';
import { IDeploymentMessage } from 'src/app/interfaces/IDeploymentMessage';
import { ILogLine } from 'src/app/interfaces/ILogLine';
import { IPage } from 'src/app/interfaces/IPage';
import { MessageHandlerService } from 'src/app/services/message-handler/message-handler.service';

@Component({
  selector: 'app-deployment-progress',
  templateUrl: './deployment-progress-modal.component.html',
  styleUrls: ['./deployment-progress-modal.component.scss'],
})
export class DeploymentProgressModalComponent implements OnInit {
  message: string;
  deploymentCompleted = false;
  pagesToInstall: IPage[];
  activePage: IPage;
  bufferValue = 0;
  constructor(
    private deploymentService: DeploymentService,
    public dialogRef: MatDialogRef<DeploymentProgressModalComponent>,
    private backendService: BackendService,
    private errorHandler: MessageHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: IDeploymentInfo
  ) {}

  ngOnInit(): void {
    try {
      if (this.data.deleteMode) {
        this.data.domains = this.data.domains.reverse();
      }
      this.pagesToInstall = [];
      if (this.data) {
        for (const domain of this.data.domains) {
          for (const page of domain.pages) {
            this.pagesToInstall.push(page);
          }
        }
        this.activePage = this.pagesToInstall[0];
        this.activePage.logs = [];
        if (!this.data.deploymentIdentifier) {
          this.backendService
            .startDeployment(this.data.domains, this.data.deleteMode)
            .then((deploymentIdentifier) => {
              this.setupScoket(deploymentIdentifier);
            })
            .catch((error) => {
              this.errorHandler.onErrorOccured.next(error.response.data.error);
              this.close();
            });
        } else {
          this.setupScoket(this.data.deploymentIdentifier);
        }
      }
    } catch (error) {
      this.errorHandler.onErrorOccured.next(error.message);
      this.close();
    }
  }

  private setupScoket(deploymentIdentifier: string) {
    this.deploymentService.setupSocketConnection(deploymentIdentifier);
    this.message = 'Warming up...';
    this.deploymentService.progressUpdate.subscribe(
      (message: IDeploymentMessage) => {
        this.onDeploymentMessage(message);
      }
    );
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
      const line: ILogLine = {
        color: 'red',
        time: new Date().toLocaleString(),
        content: deploymentMessage.log,
      };
      this.activePage.logs.push(line);
    } else if (this.activePage.icon !== 'clear' && deploymentMessage.final) {
      this.activePage.icon = 'done';
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

    if (this.activePage.icon && this.bufferValue === 100) {
      this.deploymentCompleted = true;
    }
  }

  public close() {
    this.dialogRef.close();
  }
}
