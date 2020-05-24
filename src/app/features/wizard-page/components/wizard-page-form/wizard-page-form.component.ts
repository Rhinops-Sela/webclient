import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IUserInput } from "src/app/commons/models/IUserInput";
import { IFormService } from "src/app/commons/services/form.service/form.service.interface";
import { FormService } from "src/app/commons/services/form.service/form.service";
import { FormGroup, FormControl } from "@angular/forms";
import { IFormInputService } from "src/app/commons/services/form-input.service/form-input.service.interface";
import { FormInputService } from "src/app/commons/services/form-input.service/form-input.service";
import { IInput } from "src/app/commons/models/IInput";
import { log } from "util";

@Component({
  selector: "app-wizard-page-form",
  templateUrl: "./wizard-page-form.component.html",
  styleUrls: ["./wizard-page-form.component.css"],
})
export class WizardPageFormComponent implements OnInit {
  @Input() wizardPageUserInputs: IUserInput[];
  formService: IFormService;
  formInputService: IFormInputService;
  wizardPageForm: FormGroup;
  inputs: IInput = {};
  inputsKeys: string[] = [];
  enabler: boolean = false;
  repeatable: boolean = false;
  showForm: boolean = true;
  errors: any = [];

  constructor(formService: FormService, formInputService: FormInputService) {
    this.formService = formService;
    this.formInputService = formInputService;
  }

  ngOnInit() {
    this.initializeInputs();
    this.initializeForm();
  }

  initializeInputs() {
    this.wizardPageUserInputs.forEach((input) => {
      if (input.subGroupEnabler) {
        this.enabler = input.subGroupEnabler;
        this.showForm = false;
      }
      if (input.subGroupRepeatable) {
        this.repeatable = input.subGroupRepeatable;
      }
      if (input.userValueType !== "BOOLEAN") {
        if (input.userValueType === "STRING[]") {
          input.userValueType = "STRING_ARR";
        }
        const inputRes: FormControl = this.formInputService.createInput(input);
        if (this.inputs[input.userValueType]) {
          this.inputs[input.userValueType] = [
            ...this.inputs[input.userValueType],
            { formControl: inputRes, userInput: input },
          ];
        } else {
          this.inputs[input.userValueType] = [
            { formControl: inputRes, userInput: input },
          ];
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
    const keys = Object.keys(this.inputs);
    keys.forEach((key) => {
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
      //do something
      alert("good");
    }
  }
}
