import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomFormInputsModule } from "./modules/custom-form-inputs/custom-form-inputs.module";
import { FormInputService } from "./services/form-input.service/form-input.service";
import { FormService } from './services/form.service/form.service';
import { WizardPagesService } from './services/wizard-pages.service/wizard-pages.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, CustomFormInputsModule],
  providers: [FormInputService,FormService, WizardPagesService],
  exports: [CustomFormInputsModule],
})
export class CommonsModule {}
