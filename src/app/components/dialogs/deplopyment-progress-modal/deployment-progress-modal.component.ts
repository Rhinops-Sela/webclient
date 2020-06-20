import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeploymentService } from 'src/app/services/deployment/deployment.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { IDeploymentInfo } from 'src/app/interfaces/client/IDeploymentInfo';
import { IDeploymentMessage } from 'src/app/interfaces/common/IDeploymentMessage';
import { ILogLine } from 'src/app/interfaces/client/ILogLine';
import { IPage } from 'src/app/interfaces/common/IPage';
import { MessageHandlerService } from 'src/app/services/message-handler/message-handler.service';

@Component({
  selector: 'app-deployment-progress',
  templateUrl: './deployment-progress-modal.component.html',
  styleUrls: ['./deployment-progress-modal.component.scss'],
})
export class DeploymentProgressModalComponent implements OnInit {
  log: string;
  deploymentCompleted = false;
  cancelPressed = false;
  deploymentStarted = false;
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
      }
    } catch (error) {
      this.errorHandler.onErrorOccured.next(error.message);
      this.close();
    }
  }
  cancelDeployment() {
    this.deploymentService.sendKillMessage();
    this.cancelPressed = true;
  }
  initDeployment() {
    this.backendService
      .startDeployment(this.data.domains, this.data.deleteMode)
      .then((deploymentIdentifier) => {
        this.setupScoket(deploymentIdentifier);
        this.deploymentStarted = true;
        this.deploymentCompleted = false;
      })
      .catch((error) => {
        this.errorHandler.onErrorOccured.next(error.response.data.error);
        this.close();
      });
  }

  private setupScoket(deploymentIdentifier: string) {
    this.deploymentService.setupSocketConnection(deploymentIdentifier);
    this.log = 'Warming up...';
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

  getPageDisplayName(page: IPage) {
    if (page.repeatable && page.inputs[0].value) {
      return `${page.displayName}-${page.inputs[0].value}`;
    }
    return page.displayName;
  }

  private async onDeploymentMessage(deploymentMessage: IDeploymentMessage) {
    this.log = deploymentMessage.log;
    if (this.activePage.name !== deploymentMessage.pageName) {
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
    let line: ILogLine;
    line = {
      color: '#f2f3f4',
      time: new Date().toLocaleString(),
      content: deploymentMessage.log,
    };
    if (deploymentMessage.error) {
      this.activePage.icon = 'clear';
      line.color = 'red';
    } else if (this.activePage.icon !== 'clear' && deploymentMessage.final) {
      this.activePage.icon = 'done';
    }

    if (line.content.length > 0 || line.content.trim().length > 0) {
      this.activePage.logs.push(line);
    }
    if (deploymentMessage.progress) {
      this.bufferValue = Math.round(
        (deploymentMessage.progress.currentPage /
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
