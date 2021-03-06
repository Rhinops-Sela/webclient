import { Injectable } from '@angular/core';
import config from '../../../assets/config.json';
import { IDomain } from 'src/app/interfaces/common/IDomain';
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
      return form.data.form;
    } catch (error) {
      console.log(error);
    }
  }

  async startDeployment(form: IDomain[], deleteMode: boolean = false) {
    try {
      let result: AxiosResponse<any>;
      result = await axios.post(`${this.backendUrl}/deployment`, {
        form,
        deleteMode,
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}
