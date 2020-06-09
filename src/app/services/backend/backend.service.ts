import { Injectable } from '@angular/core';
import config from '../../../assets/config.json';
import { IDomain } from 'src/app/interfaces/IDomain';
import axios from 'axios';
@Injectable({
  providedIn: 'root'
})

export class BackendService {
  backendUrl = `${config.backendUrl}:${config.backendPort}`;

  constructor() { }

  async getFormTemplate(): Promise<IDomain[]> {
    try {
      const form = await axios.get(`http://localhost:3000/deployment/form`);
      return form.data;
    } catch (error) {
      console.log(error);
    }
  }

  async startDeployment(form: IDomain[]) {
    try {
      const result = await axios.post(`http://localhost:3000/deployment/start`, { form });
      return result.status;
    } catch (error) {
      console.log(error);
    }
  }
}
