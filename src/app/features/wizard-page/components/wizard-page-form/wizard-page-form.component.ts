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
  @Output() onSubmit = new EventEmitter<IUserInput[]>();
  formService: IFormService;
  formInputService: IFormInputService;
  wizardPagesService: IWizardPagesService;
  wizardPageForm: FormGroup;
  inputs: IInput = {};
  inputsKeys: string[] = [];
  enabler: boolean = false;
  repeatable: boolean = false;
  showForm: boolean = true;
  errors: any = [];
  subGroupEnabler = {};
  enablerInputs: IInput = {};
  subGroupEnablerKeys: string[];

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
    console.log(this.subGroupEnabler);
    console.log(this.inputs);
    this.subGroupEnablerKeys = Object.keys(this.subGroupEnabler);
  }

  initializeInputs() {
    this.wizardPageUserInputs.forEach((input) => {
      const { subGroup } = input;

      if (input.subGroupRepeatable) this.repeatable = input.subGroupRepeatable;

      if (input.userValueType !== "BOOLEAN") {
        if (input.userValueType === "STRING[]") {
          input.userValueType = "STRING_ARR";
        }

        const inputRes: FormControl = this.formInputService.createInput(input);

        const tmp = { formControl: inputRes, userInput: input };

        if (input.subGroupEnabler) {
          this.subGroupEnabler[subGroup] = true;
        } else {
          if (!this.subGroupEnabler[subGroup])
            this.subGroupEnabler[subGroup] = false;
          if (this.inputs[input.userValueType]) {
            this.inputs[input.userValueType] = [
              ...this.inputs[input.userValueType],
              tmp,
            ];
          } else {
            this.inputs[input.userValueType] = [tmp];
          }
        }
      }
    });
  }

  initializeForm() {
    this.inputsKeys = Object.keys(this.inputs);
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
    this.errors = [];
    // const keys = Object.keys(this.inputs);
    this.inputsKeys.forEach((key) => {
      this.inputs[key].forEach((input) => {
        let err: string = input.userInput.displayName;
        const errKeys = input.formControl.errors
          ? Object.keys(input.formControl.errors)
          : [];
        errKeys.forEach((errKey) => {
          err += ` ${errKey}`;
        });
        if (input.formControl.errors) this.errors = [...this.errors, err];
        this.wizardPageForm;
      });
    });

    if (this.errors.length === 0) {
      this.inputsKeys.forEach((key) => {
        let i = 0;
        const length = this.inputs[key].length;
        for (i; i < length; i++) {
          this.inputs[key][i].userInput.value = this.inputs[key][
            i
          ].formControl.value;
        }
      });
      this.onSubmit.emit(this.wizardPageUserInputs);
    }
  }
}
