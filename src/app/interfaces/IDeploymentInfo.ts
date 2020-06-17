import { IDomain } from './IDomain';

export interface IDeploymentInfo {
  domains: IDomain[];
  deleteMode: boolean;
  deploymentIdentifier?: string;
}
