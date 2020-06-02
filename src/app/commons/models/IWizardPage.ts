import { IUserInput } from "./IUserInput";

export interface IWizardPage {
  header: string;
  info: string;
  image: string;
  repeatable: boolean;
  formType?: string;
  userValueType: IUserInput[];
}
