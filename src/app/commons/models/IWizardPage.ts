import { IUserInput } from "./IUserInput";

export interface IWizardPage {
  header: string;
  info: string;
  image: string;
  userValueType: IUserInput[];
}
