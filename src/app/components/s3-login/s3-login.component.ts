import { S3Service } from './../../services/s3/s3.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IS3Bucket } from 'src/app/interfaces/IS3';
import { FormBuilder } from '@angular/forms';
import { MessageHandlerService } from 'src/app/services/message-handler/message-handler.service';

@Component({
  selector: 'app-s3-login',
  templateUrl: './s3-login.component.html',
  styleUrls: ['./s3-login.component.scss'],
})
export class S3LoginComponent implements OnInit {
  credentialsValid: boolean;
  credentialsForm;
  constructor(
    private s3Service: S3Service,
    public dialogRef: MatDialogRef<S3LoginComponent>,
    private formBuilder: FormBuilder,
    private errorHandler: MessageHandlerService
  ) {}

  ngOnInit(): void {
    this.credentialsForm = this.formBuilder.group({
      accessKeyId: '',
      secretAccessKey: '',
      region: '',
      bucketName: '',
      storeCredentials: false,
    });
  }

  public verifyCredentials() {
    if (!this.credentialsForm.valid) {
      return;
    }
    const bucketInfo: IS3Bucket = {
      accessKeyId: this.credentialsForm.controls.accessKeyId.value,
      secretAccessKey: this.credentialsForm.controls.secretAccessKey.value,
      region: this.credentialsForm.controls.region.value,
      bucketName: this.credentialsForm.controls.bucketName.value,
      storeCredentials: this.credentialsForm.controls.storeCredentials.value,
    };
    this.s3Service.setCredentials(bucketInfo).then((response) => {
      if (!response) {
        this.errorHandler.onErrorOccured.next("Invalid S3 Credentials")
        return;
      }
      this.dialogRef.close({ response: response });
    });
  }

  public onCancel() {
    this.dialogRef.close({ response: false });
  }
}
