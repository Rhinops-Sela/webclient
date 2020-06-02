import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IUserInput } from "src/app/commons/models/IUserInput";
import { IFormService } from "src/app/commons/services/form.service/form.service.interface";
import { FormService } from "src/app/commons/services/form.service/form.service";
import { FormGroup, FormControl } from "@angular/forms";
import { IFormInputService } from "src/app/commons/services/form-input.service/form-input.service.interface";
import { FormInputService } from "src/app/commons/services/form-input.service/form-input.service";
import { IWizardPagesService } from "src/app/commons/services/wizard-pages.service/IWizardPagesService.interface";
import { WizardPagesService } from "src/app/commons/services/wizard-pages.service/wizard-pages.service";
import { INavigationService } from "src/app/shared/services/INavigation.service.interface";
import { NavigateService } from "src/app/shared/services/navigation.service";

@Component({
  selector: "app-wizard-page-form",
  templateUrl: "./wizard-page-form.component.html",
  styleUrls: ["./wizard-page-form.component.css"],
})
export class WizardPageFormComponent implements OnInit {
  @Input() wizardPageUserInputs: IUserInput[];
  @Input() isFirstPage: boolean;
  @Input() isLastPage: boolean;
  @Input() repeatable: boolean;
  @Input() index: number;
  @Input() isCondition: boolean = false;
  @Input() lastIsCondition: boolean = false;
  @Output() onSubmit = new EventEmitter<number>();
  @Output() onSubmitForMore = new EventEmitter<number>();
  @Output() onSubmitCondition = new EventEmitter<IUserInput[]>();
  @Output() onPrevious = new EventEmitter<number>();
  formService: IFormService;
  formInputService: IFormInputService;
  wizardPagesService: IWizardPagesService;
  wizardPageForm: FormGroup;
  inputs: any = {};
  inputsKeys: string[] = [];
  showForm: boolean = true;
  errors: string[] = [];
  subGroups: any = {};
  navigationService: INavigationService;
  constructor(
    formService: FormService,
    formInputService: FormInputService,
    wizardPagesService: WizardPagesService,
    navigateService: NavigateService
  ) {
    this.formService = formService;
    this.formInputService = formInputService;
    this.wizardPagesService = wizardPagesService;
    this.navigationService = navigateService;
  }

  ngOnInit() {
    this.initializeInputs();
    this.initializeForm();
    this.inputsKeys = Object.keys(this.inputs);
  }



  previous() {
    this.onPrevious.emit(this.index);
  }

  allowInputShown(type: string, index: number, input: IUserInput): boolean {
    const key = `${type}${index}`;
    const isSameType = input.userValueType === type;
    const keyExists = key in this.wizardPageForm.controls;

    const allow = isSameType && keyExists;

    return allow && input.isVisible;
  }

  handelCheckbox(event) {
    if (event.enabler) {
      this.inputsKeys.forEach((key) => {
        const input = this.inputs[key].input;
        if (!input.subGroupEnabler && input.subGroup === event.subGroup) {
          input.isVisible = event.value;
        }
      });
    }
  }

  initializeInputs() {
    let i = 0;
    const length = this.wizardPageUserInputs.length;

    for (i; i < length; i++) {
      const input = this.wizardPageUserInputs[i];
      if (input.subGroupEnabler) {
        input.value = true;
      }

      if (input.userValueType === "STRING[]") {
        input.userValueType = "ARR_STRING";
      }
      input.isVisible = true;
      const formControl: FormControl = this.formInputService.createInput(input);

      const tmp = {
        key: `${input.userValueType}${i}`,
        value: {
          formControl: formControl,
          input: input,
        },
      };
      this.inputs[tmp.key] = tmp.value;
    }
  }

  onRepeat() {
    const validate = this.validate();
    if (validate) {
      this.wizardPagesService.repeatPage(this.index, this.wizardPageUserInputs);
      this.onSubmit.emit(this.index);
    } else {
      alert("Invalid form");
    }
  }

  initializeForm() {
    const group = this.formService.createForm(this.inputs);
    this.wizardPageForm = new FormGroup(group);
  }

  checkInputDirtness(type: string, index: number) {
    const name = `${type}${index}`;
    const res = this.wizardPageForm.get(name);
    return res.dirty || res.touched;
  }

  checkInputErrors(type: string, index: number) {
    const name = `${type}${index}`;
    const res = this.wizardPageForm.get(name);
    return res.errors;
  }

  validate() {
    this.errors = [];
    const keys = Object.keys(this.inputs);
    keys.forEach((key) => {
      const { formControl } = this.inputs[key];
      const { input } = this.inputs[key];
      if (formControl.errors && input.isVisible) {
        // console.log(input.errMsg);

        // let err: string = `${input.displayName} `;
        // const errKeys = Object.keys(formControl.errors);
        // errKeys.forEach((errKey) => {
        //   err += `${errKey} `;
        // });
        // this.errors.push(err);
        this.errors.push(input.errMsg);
      } else {
        input.value = formControl.value;
      }
    });
    if (this.errors.length === 0) {
      return true;
    } else return false;
  }

  submit() {
    const validate = this.validate();
    if (validate) {
      if (this.isCondition) {
        this.onSubmitCondition.emit(this.wizardPageUserInputs);
      } else {
        if (!this.isLastPage) {
          this.wizardPagesService.updateWizardPages(
            this.index,
            this.wizardPageUserInputs
          );
          this.onSubmit.emit(this.index);
        } else {
          const last = this.wizardPageUserInputs[
            this.wizardPageUserInputs.length - 1
          ];
          if (this.lastIsCondition) {
            this.wizardPagesService.getMorePages();
            this.onSubmitForMore.emit(this.index);
          } else {
            this.wizardPagesService
              .postPages(this.wizardPageUserInputs)
              .subscribe(
                (res) => {
                  this.navigationService.navigate("wizard");
                  this.wizardPagesService.wizardPages$.next([]);
                },
                (err) => {}
              );
          }
        }
      }
    }
  }
}
