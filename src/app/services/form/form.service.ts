import { Injectable } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { IInput } from 'src/app/interfaces/IInput';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() { }
  toFormGroup(inputs: IInput[]) {
    const group: any = {};

    inputs.forEach((input) => {
      group[input.id] = input.regexValidation
        ? new FormControl(input.value || '', [
          Validators.pattern(input.regexValidation),
          Validators.required
        ])
        : new FormControl(input.value || '');
    });
    return new FormGroup(group);
  }
}
