import { FormControl } from "@angular/forms";
import { IUserInput } from "./IUserInput";

export interface IInput {
  key?: string;
  value?: {
    formControl: FormControl;
    userInput: IUserInput;
  }[];
}
