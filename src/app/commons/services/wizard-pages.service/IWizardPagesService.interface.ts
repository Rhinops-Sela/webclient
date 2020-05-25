import { Observable, BehaviorSubject } from "rxjs";
import { IWizardPage } from "../../models/IWizardPage";

export interface IWizardPagesService {
  wizardPages$: BehaviorSubject<IWizardPage[]>;
  getPages(): Observable<any>;
  getPages2(): void;
  dataParser(pages): IWizardPage[];
  dataParser2(pages): void;
  updateWizardPages(wizardPages: IWizardPage[],index:number): boolean;
}
