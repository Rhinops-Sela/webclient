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
  createForm(inputs: any): any {
    let group = {};
    const keys = Object.keys(inputs);

    keys.forEach((key) => {
      group[key] = inputs[key].formControl;
    });
    return group;
  }
}
