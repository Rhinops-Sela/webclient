import { S3Service } from './../../services/s3/s3.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-browse-stored-files',
  templateUrl: './browse-stored-files.component.html',
  styleUrls: ['./browse-stored-files.component.scss'],
})
export class BrowseStoredFilesComponent implements OnInit {
  fileList: string[] = [];
  constructor(
    private s3Service: S3Service,
    public dialogRef: MatDialogRef<BrowseStoredFilesComponent>
  ) {}

  ngOnInit(): void {
    this.s3Service.listDeploymentFiles().then((fileList) => {
      this.fileList = fileList;
    });
  }

  async load(file: string) {
    const result = await this.s3Service.loadDeploymentFile(file);
    this.dialogRef.close({ loaded: true, loadedForm: result });
  }
}
