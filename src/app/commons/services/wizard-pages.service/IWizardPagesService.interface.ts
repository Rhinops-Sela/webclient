import { Observable, BehaviorSubject } from "rxjs";
import { IWizardPage } from "../../models/IWizardPage";
import { IUserInput } from '../../models/IUserInput';

export interface IWizardPagesService {
  wizardPages$: BehaviorSubject<IWizardPage[]>;
  getPages(): Observable<any>;
  getPages2(): void;
  dataParser(pages): IWizardPage[];
  dataParser2(pages): void;
  updateWizardPages(index: number, userInputs: IUserInput[]): void;
}
