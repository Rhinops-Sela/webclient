import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { IWizardPage } from "src/app/commons/models/IWizardPage";
import { IUserInput } from "src/app/commons/models/IUserInput";

@Component({
  selector: "app-wizard-page-layout",
  templateUrl: "./wizard-page-layout.component.html",
  styleUrls: ["./wizard-page-layout.component.css"],
})
export class WizardPageLayoutComponent implements OnInit {
  @Input() wizardPage: IWizardPage;
  @Output() onChange = new EventEmitter<IWizardPage>();
  constructor() {}

  ngOnInit() {}

  updateWizardPage(event: IUserInput[]) {
    this.wizardPage.userValueType = event;
    this.onChange.emit(this.wizardPage);
  }
}
