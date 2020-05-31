import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControlErrorShowComponent } from "./components/form-control-error-show/form-control-error-show.component";
import { FormInputDateComponent } from "./components/form-input-date/form-input-date.component";
import { FormInputErrorComponent } from "./components/form-input-error/form-input-error.component";
import { FormNumberInputComponent } from "./components/form-number-input/form-number-input.component";
import { FormPasswordInputComponent } from "./components/form-password-input/form-password-input.component";
import { FormTextAreaInputComponent } from "./components/form-text-area-input/form-text-area-input.component";
import { FormTextInputComponent } from "./components/form-text-input/form-text-input.component";
import { FormSelectInputComponent } from "./components/form-select-input/form-select-input.component";
import { FormCheckboxInputComponent } from "./components/form-checkbox-input/form-checkbox-input.component";
import { FormImageInputComponent } from "./components/form-image-input/form-image-input.component";

@NgModule({
  declarations: [
    FormControlErrorShowComponent,
    FormInputDateComponent,
    FormInputErrorComponent,
    FormNumberInputComponent,
    FormPasswordInputComponent,
    FormTextAreaInputComponent,
    FormTextInputComponent,
    FormSelectInputComponent,
    FormCheckboxInputComponent,
    FormImageInputComponent,
  ],
  imports: [CommonModule],
  exports: [
    FormControlErrorShowComponent,
    FormInputDateComponent,
    FormInputErrorComponent,
    FormNumberInputComponent,
    FormPasswordInputComponent,
    FormTextAreaInputComponent,
    FormTextInputComponent,
    FormSelectInputComponent,
    FormCheckboxInputComponent,
    FormImageInputComponent,
  ],
})
export class CustomFormInputsModule {}
