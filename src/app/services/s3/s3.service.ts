import { IS3Bucket } from '../../interfaces/IS3';
import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import S3 from 'aws-sdk/clients/s3';
import { faSafari } from '@fortawesome/free-brands-svg-icons';
import { IDomain } from '../../interfaces/IDomain';
@Injectable({
  providedIn: 'root',
})
export class S3Service {
  private readonly storageName = 's3-credentials';
  private isCredentialsSet = false;
  private credentials: IS3Bucket;
  private bucket: S3;
  constructor() {}

  public setCredentials(s3Info: IS3Bucket): boolean {
    AWS.config.credentials = new AWS.Credentials({
      accessKeyId: s3Info.accessKeyId,
      secretAccessKey: s3Info.secretAccessKey,
    });
    AWS.config.update({ region: s3Info.region });
    const result = this.verifyCredentials(s3Info.bucketName);
    if (result) {
      localStorage.setItem(this.storageName, JSON.stringify(s3Info));
      this.credentials = s3Info;
    }
    return result;
  }

  private verifyCredentials(bucketName: string): boolean {
    try {
      this.bucket = this.getBucket(bucketName);
      this.isCredentialsSet = true;
      return this.isCredentialsSet;
    } catch (error) {
      /// TODO: error handling
      console.log('failed to connect to bucket', error.message);
      this.isCredentialsSet = false;
      return false;
    }
  }

  public isCredentialsLoaded() {
    if (this.isCredentialsSet) {
      return true;
    }
    localStorage;
    const fromStorage = JSON.parse(
      localStorage.getItem(this.storageName)
    ) as IS3Bucket;
    if (!fromStorage || !this.verifyCredentials(fromStorage.bucketName)) {
      return false;
    }
    return true;
  }

  public clearCredentials() {
    localStorage.removeItem(this.storageName);
    this.isCredentialsSet = false;
  }

  private getBucket(bucketName: string): S3 {
    const s3 = new S3({
      apiVersion: '2006-03-01',
      params: { Bucket: bucketName },
    });

    return s3;
  }

  public async listDeploymentFiles(): Promise<string[]> {
    if (!this.isCredentialsLoaded) {
      /// TODO: error handling
      return null;
    }
    const fileNames: string[] = [];
    const data = await this.bucket
      .listObjectsV2({
        Bucket: this.credentials.bucketName,
      })
      .promise();

    data.Contents.forEach((elem) => {
      fileNames.push(elem.Key);
    });

    return fileNames;
  }

  public async loadDeploymentFile(fileNmae: string): Promise<IDomain[]> {
    if (!this.isCredentialsLoaded) {
      /// TODO: error handling
      return null;
    }
    const response = await this.bucket
      .getObject({
        Bucket: this.credentials.bucketName,
        Key: fileNmae,
      })
      .promise();

    return JSON.parse(response.Body.toString());
  }
}
