import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IUserInput } from "src/app/commons/models/IUserInput";
import { IFormService } from "src/app/commons/services/form.service/form.service.interface";
import { FormService } from "src/app/commons/services/form.service/form.service";
import { FormGroup, FormControl } from "@angular/forms";
import { IFormInputService } from "src/app/commons/services/form-input.service/form-input.service.interface";
import { FormInputService } from "src/app/commons/services/form-input.service/form-input.service";
import { IInput } from "src/app/commons/models/IInput";
import { IWizardPagesService } from "src/app/commons/services/wizard-pages.service/IWizardPagesService.interface";
import { WizardPagesService } from "src/app/commons/services/wizard-pages.service/wizard-pages.service";

@Component({
  selector: "app-wizard-page-form",
  templateUrl: "./wizard-page-form.component.html",
  styleUrls: ["./wizard-page-form.component.css"],
})
export class WizardPageFormComponent implements OnInit {
  @Input() wizardPageUserInputs: IUserInput[];
  @Input() isFirstPage: boolean;
  @Input() isLastPage: boolean;
  @Input() index: number;
  @Output() onSubmit = new EventEmitter<number>();
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
  constructor(
    formService: FormService,
    formInputService: FormInputService,
    wizardPagesService: WizardPagesService
  ) {
    this.formService = formService;
    this.formInputService = formInputService;
    this.wizardPagesService = wizardPagesService;
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

    return allow;
  }

  subGroup: string = "";

  initializeInputs() {
    let i = 0;
    const length = this.wizardPageUserInputs.length;

    for (i; i < length; i++) {
      const input = this.wizardPageUserInputs[i];
      this.subGroups[this.subGroup] = true
      if (input.subGroupEnabler) {
        this.subGroup = input.subGroup;
        // this.enablerShowInputs[this.subGroup] = [];
        this.subGroups[this.subGroup] = false;
        // console.log(this.subGroups)
      }

      // if (this.subGroup === input.subGroup) {
      //   this.enablerShowInputs[this.subGroup].push(input);
      // }

      if (input.userValueType === "STRING[]") {
        input.userValueType = "ARR_STRING";
      }

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

  onRepeat(input: IUserInput, index: number) {
    const formControl: FormControl = this.formInputService.createInput(input);
    const type = input.userValueType;
    let relevanceKey: string;
    this.inputsKeys.forEach((key) => {
      if (key.startsWith(type)) {
        relevanceKey = key;
      }
    });
    console.log(relevanceKey);

    input.subGroupRepeatable = undefined;
    const i = parseInt(relevanceKey.split(type)[1]);
    console.log(i);
    const tmp = {
      key: `${input.userValueType}${i + 1}`,
      value: {
        formControl: formControl,
        input: { ...input },
      },
    };
    // this.wizardPageUserInputs
    // console.log(this.wizardPageUserInputs);
    this.wizardPageUserInputs.splice(i + 1, 0, tmp.value.input);
    // this.wizardPageUserInputs.push(tmp.value.input);
    // console.log(this.wizardPageUserInputs);

    this.inputs[tmp.key] = tmp.value;

    this.wizardPageForm.addControl(tmp.key, tmp.value.formControl);
    this.inputsKeys = Object.keys(this.inputs);
    // console.log(this.wizardPageForm.controls);
  }

  initializeForm() {
    // console.log(this.enablerShowInputs);

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

  submit() {
    // this.errors = [];
    // const keys = Object.keys(this.inputs);
    // keys.forEach((key) => {
    //   const { formControl } = this.inputs[key];
    //   const { input } = this.inputs[key];
    //   if (formControl.errors) {
    //     let err: string = `${input.displayName} `;
    //     const errKeys = Object.keys(formControl.errors);
    //     errKeys.forEach((errKey) => {
    //       err += `${errKey} `;
    //     });
    //     this.errors.push(err);
    //   } else {
    //     // console.log(formControl.value);

    //     input.value = formControl.value;
    //   }
    // });
    // if (this.errors.length === 0) {
    //    console.log(this.wizardPageUserInputs);

    //   // this.wizardPagesService.updateWizardPages(
    //   //   this.index,
    //   //   this.wizardPageUserInputs
    //   // );
    this.onSubmit.emit(this.index);
    // }
  }
}
