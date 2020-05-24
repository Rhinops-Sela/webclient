import { Component, OnInit, Input } from "@angular/core";
import { IWizardPage } from "src/app/commons/models/IWizardPage";

@Component({
  selector: "app-wizard-page-layout",
  templateUrl: "./wizard-page-layout.component.html",
  styleUrls: ["./wizard-page-layout.component.css"],
})
export class WizardPageLayoutComponent implements OnInit {
  @Input() wizardPage: IWizardPage;
  constructor() {
  }

  ngOnInit() {}
}
