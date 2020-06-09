import { IDomain } from './IDomain';

export interface IDeploymentInfo {
  domains: IDomain[];
  deploymentIdentifier?: string;
}
