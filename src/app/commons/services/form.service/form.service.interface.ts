import { IUserInput } from '../../models/IUserInput';
import { FormControl, FormGroup } from '@angular/forms';
import { IInput } from '../../models/IInput';

export interface IFormService{
    createForm(userInputs: IInput):any
}