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
  @Input() isFirstPage: boolean;
  @Input() isLastPage: boolean;
  @Input() isCondition: boolean;

  @Input() index: number;
  @Output() onFormSubmit = new EventEmitter<number>();
  @Output() onFormSubmitForMore = new EventEmitter<number>();
  @Output() onFormSubmitCondition = new EventEmitter<IUserInput[]>();
  @Output() onPrevious = new EventEmitter<number>();
  forms: IWizardPage[] = [];
  constructor() {}

  ngOnInit() {
    this.forms.push(this.wizardPage);
    this.isCondition ? (this.isCondition = true) : (this.isCondition = false);
  }

  previous(index: number) {
    this.onPrevious.emit(index);
  }
  onSubmit(index: number) {
    this.onFormSubmit.emit(index);
  }

  onSubmitForMore(index: number) {
    this.onFormSubmitForMore.emit(index);
  }

  onSubmitCondition(inputs: IUserInput[]) {
    this.onFormSubmitCondition.emit(inputs);
  }
}
