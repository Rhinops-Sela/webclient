import { IUserInput } from "../../models/IUserInput";
import { FormControl } from "@angular/forms";

export interface IFormInputService {
  print: () => void;
  createInput(userInput: IUserInput): FormControl;
}
