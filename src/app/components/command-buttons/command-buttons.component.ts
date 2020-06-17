import { ProgressHandlerService } from './../../services/progress-handler/progress-handler.service';
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
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
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
    private messageHandlerService: MessageHandlerService,
    public dialog: MatDialog,
    private progressHandlerService: ProgressHandlerService
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
    this.s3Service.listDeploymentFiles().then((fileList) => {
      this.progressHandlerService.onActionCompleted.next(true);
      const dialogRef = this.dialog.open(BrowseStoredFilesComponent, {
        data: fileList,
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result.loaded) {
          this.globalService.uploadForm(JSON.stringify(result.loadedForm));
          this.messageHandlerService.onUserMessage.next('Loaded Successfuly!');
          this.router.navigate(['']);
        }
      });
    });
  }

  browse() {
    this.dialog.open(ProgressSpinnerComponent, {
      data: {
        header: 'Loading Files From S3 Bucket',
        subheader: 'Searching for files on S3 bucket...',
      },
      disableClose: true,
    });
    this.s3Service.isCredentialsLoaded().then((valid) => {
      if (valid) {
        this.openS3Browser();
      } else {
        const dialogRef = this.dialog.open(S3LoginComponent, {
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe((valid: any) => {
          if (valid.response) {
            this.openS3Browser();
          } else {
            this.progressHandlerService.onActionCompleted.next(true);
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

  private openProgressDialog(domainsToInstall: IDomain[], deleteMode: boolean) {
    const dialogRef = this.dialog.open(DeploymentProgressModalComponent, {
      data: { domains: domainsToInstall, deleteMode: deleteMode },
      disableClose: true,
    });
    const deploymentService = this.deploymentService;
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      deploymentService.closeSocket();
    });
  }

  public async storeToS3() {
    this.dialog.open(ProgressSpinnerComponent, {
      data: {
        header: 'Uploading Files To S3 Bucket',
        subheader: 'Storing files on S3 bucket',
      },
      disableClose: true,
    });
    let upload = false;
    const loadedCredentials = await this.s3Service.isCredentialsLoaded();

    if (!loadedCredentials) {
      const dialogRef = this.dialog.open(S3LoginComponent, {
        disableClose: true,
      });
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
        this.messageHandlerService.onUserMessage.next(
          'File Was Successfuly Uploaded'
        );
      } catch (error) {
        this.messageHandlerService.onErrorOccured.next(
          `Failed to save to S3 bucket: ${error.message}`
        );
      }
    }
    this.progressHandlerService.onActionCompleted.next(true);
  }

  private async uploadBeforeDeployment() {
    const allDomains = await this.globalService.getAllDomains();
    await this.s3Service.uploadForm(JSON.stringify(allDomains), this.fileName);
  }

  private async getModifiedList(): Promise<IDomain[]> {
    const modifiedList: IDomain[] = [];
    const domainList: IDomain[] = await this.globalService.getAllDomains();
    for (const domain of domainList) {
      const domainClone = JSON.parse(JSON.stringify(domain)) as IDomain;
      const pages = domainClone.pages.filter((page) => {
        return page.modified === true;
      });
      domainClone.pages = pages;
      if (pages.length > 0) {
        modifiedList.push(domainClone);
      }
    }
    return modifiedList;
  }

  public async openConfirmationDialog(deleteMode: boolean) {
    const notCompleted = this.globalService.verifyMandatory();
    const modifiedDomainList = await this.getModifiedList();
    if (notCompleted.length === 0 && modifiedDomainList.length > 0) {
      if (!deleteMode) {
        await this.storeToS3();
      }
      const dialogRef = this.dialog.open(ConfirmationModalComponent, {
        data: {
          modifiedDomainList: modifiedDomainList,
          deleteMode: deleteMode,
        },
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result: IConfirmationResponse) => {
        if (result && result.response && result.domainList.length > 0) {
          if (!deleteMode) {
            this.export();
          }
          this.openProgressDialog(result.domainList, deleteMode);
        }
      });
    } else {
      if (modifiedDomainList.length === 0) {
        this.messageHandlerService.onErrorOccured.next(`No pages with data`);
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
