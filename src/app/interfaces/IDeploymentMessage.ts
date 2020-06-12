import { IDploymentProgress } from './IDeplopymentProgress';


export interface IDeploymentMessage {
  message: string;
  log?: any;
  progress?: IDploymentProgress;
  final?: true;
  error?: boolean;
}
