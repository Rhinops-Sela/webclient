import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WizardMainLayoutComponent } from 'src/app/features/wizard-page/components/wizard-main-layout/wizard-main-layout.component';

const routes: Routes = [
  { path: "", redirectTo: "/wizard", pathMatch: "full" },
  {
    path: "wizard",
    loadChildren: () =>
      import("../../features/wizard-page/wizard-page.module").then(
        (m) => m.WizardPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
