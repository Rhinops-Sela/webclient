import { Component, OnInit } from "@angular/core";
import { INavigationService } from "src/app/shared/services/INavigation.service.interface";
import { NavigateService } from "src/app/shared/services/navigation.service";
import { WizardPagesService } from "src/app/commons/services/wizard-pages.service/wizard-pages.service";
import { IWizardPagesService } from "src/app/commons/services/wizard-pages.service/IWizardPagesService.interface";
import { IWizardPage } from "src/app/commons/models/IWizardPage";
import { IUserInput } from "src/app/commons/models/IUserInput";

@Component({
  selector: "app-wizard-main-layout",
  templateUrl: "./wizard-main-layout.component.html",
  styleUrls: ["./wizard-main-layout.component.css"],
})
export class WizardMainLayoutComponent implements OnInit {
  navigationService: INavigationService;
  showActions: boolean = true;
  wizardPagesService: IWizardPagesService;
  inputs: IWizardPage[];

  constructor(
    navigationService: NavigateService,
    wizardPagesService: WizardPagesService
  ) {
    this.navigationService = navigationService;
    this.wizardPagesService = wizardPagesService;
  }

  ngOnInit() {
    this.getConditionsPages();
  }

  getConditionsPages() {
    this.wizardPagesService.getConditionsPages().subscribe(
      (res: IWizardPage[]) => {
        this.inputs = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  navigate(toImport: boolean) {
    this.navigationService.navigateWithParameter("/wizard/pages", { toImport });
  }

  onFormSubmitCondition(inputs: IUserInput[]) {
    this.showActions = true;
  }
}
