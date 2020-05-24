import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WizardMainLayoutComponent } from 'src/app/features/wizard-page/components/wizard-main-layout/wizard-main-layout.component';
import { WizardPagesListComponent } from 'src/app/features/wizard-page/components/wizard-pages-list/wizard-pages-list.component';


const routes: Routes = [
//   { path: "", redirectTo: "", pathMatch: "full" },
  { path: "pages", component: WizardPagesListComponent},
  { path: "", component: WizardMainLayoutComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WizardPageRouting {}
