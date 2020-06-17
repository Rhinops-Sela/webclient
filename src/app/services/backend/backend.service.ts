import { Injectable } from '@angular/core';
import config from '../../../assets/config.json';
import { IDomain } from 'src/app/interfaces/IDomain';
import axios, { AxiosResponse } from 'axios';
@Injectable({
  providedIn: 'root',
})
export class BackendService {
  backendUrl = `${config.backendUrl}:${config.backendPort}`;
  workingFolders: string[];
  deploymentIdentifier: string;
  constructor() {}

  async getFormTemplate(): Promise<IDomain[]> {
    try {
      const form = await axios.get(`${this.backendUrl}/deployment/form`);
      return form.data;
    } catch (error) {
      console.log(error);
    }
  }

  async startDeployment(form: IDomain[], deleteMode: boolean = false) {
    try {
      let result: AxiosResponse<any>;
      if (deleteMode) {
        result = await axios.delete(`${this.backendUrl}/deployment`, {
          data: {
            form,
            workingFolders: this.workingFolders,
            deploymentIdentifier: this.deploymentIdentifier,
          },
        });
      } else {
        result = await axios.post(`${this.backendUrl}/deployment`, {
          form,
          workingFolders: this.workingFolders,
          deploymentIdentifier: this.deploymentIdentifier,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async prepareDeployment(form: IDomain[]) {
    try {
      let result: AxiosResponse<any>;
      result = await axios.post(`${this.backendUrl}/deployment/prepare`, {
        form,
      });
      this.workingFolders = result.data.workingFolders;
      this.deploymentIdentifier = result.data.deploymentIdentifier;
      return this.deploymentIdentifier;
    } catch (error) {
      throw error;
    }
  }
}
