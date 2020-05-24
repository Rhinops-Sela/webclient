import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WizardPageModule } from "./wizard-page/wizard-page.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, WizardPageModule],
  exports: [WizardPageModule],
})
export class FeaturesModule {}
