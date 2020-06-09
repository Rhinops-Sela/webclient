import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeploymentService } from 'src/app/services/deployment/deployment.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { IDeploymentInfo } from 'src/app/interfaces/IDeploymentInfo';

@Component({
  selector: 'app-deployment-progress',
  templateUrl: './deployment-progress-modal.component.html',
  styleUrls: ['./deployment-progress-modal.component.scss']
})
export class DeploymentProgressModalComponent implements OnInit {
  message: string;
  constructor(private deploymentService: DeploymentService, public dialogRef: MatDialogRef<DeploymentProgressModalComponent>, private backendService: BackendService, @Inject(MAT_DIALOG_DATA) public data: IDeploymentInfo) { }

  ngOnInit(): void {
    try {

      if (this.data) {
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
    this.message = 'no messages yet';
    this.deploymentService.progressUpdate.subscribe((message) => {
      this.onDeploymentMessage(message);
    });
  }

  private onDeploymentMessage(message: string) {
    this.message = message;
  }



}
