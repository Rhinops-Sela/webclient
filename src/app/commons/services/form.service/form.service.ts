import { Injectable } from "@angular/core";
import { IUserInput } from "../../models/IUserInput";
import { FormGroup, FormControl } from "@angular/forms";
import { IFormInputService } from "../form-input.service/form-input.service.interface";
import { FormInputService } from "../form-input.service/form-input.service";
import { IFormService } from "./form.service.interface";
import { IInput } from "../../models/IInput";

@Injectable({
  providedIn: "root",
})
export class FormService implements IFormService {
  formInputService: IFormInputService;
  constructor(formInputService: FormInputService) {
    this.formInputService = formInputService;
  }
  createForm(inputs: IInput): any {
    let group = {};
    // for (let index = 0; index < formControls.length; index++) {
    //   group[index] = formControls[index];
    // }
    const keys = Object.keys(inputs);
    const keysLength = keys.length;
    let i = 0;
    keys.forEach((key) => {
      const inputContainer = inputs[key];
      for (i = 0; i < inputContainer.length; i++) {
        group[key + i] = inputContainer[i].formControl;
      }
    });
    return group;
  }
}
