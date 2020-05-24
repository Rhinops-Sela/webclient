import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WizardPageHeaderComponent } from "./components/wizard-page-header/wizard-page-header.component";
import { WizardPageLayoutComponent } from "./components/wizard-page-layout/wizard-page-layout.component";
import { WizardPageInfoComponent } from "./components/wizard-page-info/wizard-page-info.component";
import { WizardPageFormComponent } from "./components/wizard-page-form/wizard-page-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonsModule } from "src/app/commons/commons.module";
import { WizardPagesListComponent } from "./components/wizard-pages-list/wizard-pages-list.component";
import { WizardMainLayoutComponent } from "./components/wizard-main-layout/wizard-main-layout.component";
import { WizardPageRouting } from "src/app/shared/routing/wizard-page-routing.module";
// import { PaginationModule } from "ngx-bootstrap/pagination";
import { TooltipModule } from "ngx-bootstrap/tooltip";
// import { TabsModule } from "ngx-bootstrap/tabs";
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [
    WizardPageHeaderComponent,
    WizardPageLayoutComponent,
    WizardPageInfoComponent,
    WizardPageFormComponent,
    WizardPagesListComponent,
    WizardMainLayoutComponent,
  ],
  imports: [
    CommonModule,
    CommonsModule,
    ReactiveFormsModule,
    WizardPageRouting,
    // PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    // TabsModule.forRoot(),
    AlertModule.forRoot(),
  ],
  exports: [WizardPageLayoutComponent],
})
export class WizardPageModule {}
