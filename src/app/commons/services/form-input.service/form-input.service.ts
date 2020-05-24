import { Injectable } from "@angular/core";
import { IFormInputService } from "./form-input.service.interface";
import { FormControl, Validators } from "@angular/forms";
import { IUserInput } from "../../models/IUserInput";
@Injectable({
  providedIn: "root",
})
export class FormInputService implements IFormInputService {
  constructor() {}
  print(): void {
    console.log("in service");
  }
  createInput(userInput: IUserInput): FormControl {
    let validators = [];
    if (userInput.userValueType !== "CHECKBOX")
      validators.push(Validators.required);

    if (userInput.regexValidation) {
      if (userInput.userValueType !== "STRING")
        validators.push(Validators.pattern(userInput.regexValidation));
    }

    if (userInput.value && userInput.value.length) {
      userInput.values = userInput.value;
    }

    const formControl = new FormControl(
      userInput.values || userInput.value || "",
      Validators.compose(validators)
    );
    formControl;
    return formControl;
  }
}
