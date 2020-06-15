import { S3Service } from './../../services/s3/s3.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IS3Bucket } from 'src/app/interfaces/IS3';
@Component({
  selector: 'app-browse-stored-files',
  templateUrl: './browse-stored-files.component.html',
  styleUrls: ['./browse-stored-files.component.scss'],
})
export class BrowseStoredFilesComponent implements OnInit {
  fileList: string[] = [];
  credentials: boolean;
  constructor(
    private s3Service: S3Service,
    public dialogRef: MatDialogRef<BrowseStoredFilesComponent>
  ) {}

  ngOnInit(): void {
    this.s3Service.setCredentials({
      accessKeyId: 'AKIAQMTJXUUI5CEWT4E7',
      secretAccessKey: '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',
      region: 'eu-west-1',
      bucketName: 'fennec-deployments',
    });
    this.credentials = this.s3Service.isCredentialsLoaded();
    if (this.credentials) {
      this.s3Service.listDeploymentFiles().then((files) => {
        this.fileList = files;
      });
    }
  }

  saveCredentials(
    region: string,
    accessKeyId: string,
    secretAccessKey: string,
    bucketName: string
  ) {
    const credentials: IS3Bucket = {
      accessKeyId,
      secretAccessKey,
      region,
      bucketName,
    };
    const result = this.s3Service.setCredentials(credentials);
    if (result) {
      this.s3Service.listDeploymentFiles().then((files) => {
        this.fileList = files;
      });
    }

    this.credentials = result;
  }

  async load(file: string) {
    const result = await this.s3Service.loadDeploymentFile(file);
    console.log(result);
  }
}
