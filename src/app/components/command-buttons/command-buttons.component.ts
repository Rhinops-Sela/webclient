import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { DeploymentProgressModalComponent } from '../deplopyment-progress-modal/deployment-progress-modal.component';
import { IDomain } from 'src/app/interfaces/IDomain';
import { IConfirmationResponse } from 'src/app/interfaces/IConfirmationResponse';
import { DeploymentService } from 'src/app/services/deployment/deployment.service';
import { BrowseStoredFilesComponent } from '../browse-stored-files/browse-stored-files.component';
import { S3Service } from 'src/app/services/s3/s3.service';
import { S3LoginComponent } from '../s3-login/s3-login.component';
import { MessageHandlerService } from 'src/app/services/message-handler/message-handler.service';
@Component({
  selector: 'app-command-buttons',
  templateUrl: './command-buttons.component.html',
  styleUrls: ['./command-buttons.component.scss'],
})
export class CommandButtonsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  uploader: any;
  private fileName = `fennec_${new Date().toISOString()}.json`;
  form: IDomain[];
  constructor(
    private s3Service: S3Service,
    private deploymentService: DeploymentService,
    private globalService: GlobalService,
    private router: Router,
    public dialog: MatDialog,
    private messageHandlerService: MessageHandlerService
  ) {}

  ngOnInit(): void {}

  home() {
    this.router.navigate(['']);
    this.globalService.resetActiveDomainText();
  }

  deleteAll() {
    this.globalService.clearAll().then((result) => {
      if (result) {
        this.router.navigate(['']);
      }
    });
  }

  openS3Browser() {
    const dialogRef = this.dialog.open(BrowseStoredFilesComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.loaded) {
        this.globalService.uploadForm(JSON.stringify(result.loadedForm));
        this.messageHandlerService.onActionCompleted.next(
          'Loaded Successfuly!'
        );
      }
    });
  }

  browse() {
    this.s3Service.isCredentialsLoaded().then((valid) => {
      if (valid) {
        this.openS3Browser();
      } else {
        const dialogRef = this.dialog.open(S3LoginComponent);
        dialogRef.afterClosed().subscribe((valid: any) => {
          if (valid.response) {
            this.openS3Browser();
          }
        });
      }
    });
  }

  async export(domainsToExport?: IDomain[]) {
    try {
      this.form = domainsToExport || (await this.globalService.getAllDomains());
      const domains = this.form;
      const jsonFormat = JSON.stringify(domains);
      const blob = new Blob([jsonFormat], { type: 'text/plain;charset=utf-8' });
      saveAs.saveAs(blob, this.fileName);
    } catch (error) {
      this.messageHandlerService.onErrorOccured.next(
        `Export failed: ${error.message}`
      );
    }
  }
  upload() {
    this.fileInput.nativeElement.click();
  }

  private openProgressDialog(domainsToInstall: IDomain[]) {
    const dialogRef = this.dialog.open(DeploymentProgressModalComponent, {
      data: { domains: domainsToInstall },
    });
    const deploymentService = this.deploymentService;
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      deploymentService.closeSocket();
    });
  }

  public async storeToS3() {
    let upload = false;
    const loadedCredentials = await this.s3Service.isCredentialsLoaded();
    if (!loadedCredentials) {
      const dialogRef = this.dialog.open(S3LoginComponent);
      const dialogResult = await dialogRef.afterClosed().toPromise();
      if (dialogResult?.response) {
        upload = true;
      }
    } else {
      upload = true;
    }
    if (upload) {
      try {
        await this.uploadBeforeDeployment();
        this.messageHandlerService.onActionCompleted.next("File Was Successfuly Uploaded");
      } catch (error) {
        this.messageHandlerService.onErrorOccured.next(
          `Failed to save to S3 bucket: ${error.message}`
        );
      }
    }
  }

  private async uploadBeforeDeployment() {
    const allDomains = await this.globalService.getAllDomains();
    await this.s3Service.uploadForm(JSON.stringify(allDomains), this.fileName);
  }

  public async openConfirmationDialog() {
    const notCompleted = this.globalService.verifyMandatory();
    if (notCompleted.length === 0) {
      await this.storeToS3();
      const dialogRef = this.dialog.open(ConfirmationModalComponent);
      dialogRef.afterClosed().subscribe((result: IConfirmationResponse) => {
        if (result && result.response && result.domainList.length > 0) {
          this.export();
          this.openProgressDialog(result.domainList);
        }
      });
    } else {
      let incompleteStr =
        'Please complete the following mandatory components: \n';
      notCompleted.forEach((domain) => {
        incompleteStr += domain.displayName + ' ,';
      });
      this.messageHandlerService.onErrorOccured.next(
        `${incompleteStr.substring(0, incompleteStr.length - 1)}`
      );
    }
  }

  onFileChanged(event) {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, 'UTF-8');
    fileReader.onload = () => {
      const result = this.globalService.uploadForm(
        fileReader.result.toString()
      );
      if (!result) {
        return;
      }
      this.fileInput.nativeElement.value = '';
      this.globalService.refreshRequired.next({
        pageChanged: true,
        domainChanged: true,
      });
      this.router.navigate(['']);
    };
    fileReader.onerror = () => {
      this.messageHandlerService.onErrorOccured.next('Failed to read file');
      this.router.navigate(['']);
    };
  }
}
