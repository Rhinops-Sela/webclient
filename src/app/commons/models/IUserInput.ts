// import { inputType } from "../enums/inputType";

export interface IUserInput {
  subGroup?: string;
  subGroupEnabler?: boolean;
  subGroupRepeatable?: boolean;
  displayName?: string;
  userValueType?: string;
  userValueTypeValues?: string[];
  // checkboxValues?: string[];
  // selectValues?: string[];
  // selectedValue?: string;
  // multiSelectValues?: string[];
  placeholder?: string;
  regexValidation?: string;
  toolTip?: string;
  value?: any;
  // values?: any[];
  // userInputs?: IUserInput[];
}
