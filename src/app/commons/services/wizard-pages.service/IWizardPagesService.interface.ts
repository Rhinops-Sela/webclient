import { Observable } from 'rxjs';
import { IWizardPage } from '../../models/IWizardPage';

export interface IWizardPagesService{
    getPages(): Observable<any>; 
    dataParser(pages):IWizardPage[]
}