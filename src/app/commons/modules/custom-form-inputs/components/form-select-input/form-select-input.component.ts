import { Component, OnInit, forwardRef, Input, Injector } from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NgControl,
} from "@angular/forms";

@Component({
  selector: "app-form-select-input",
  templateUrl: "./form-select-input.component.html",
  styleUrls: ["./form-select-input.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectInputComponent),
      multi: true,
    },
  ],
})
export class FormSelectInputComponent implements ControlValueAccessor, OnInit {
  onModelChange: Function = (value: any) => {};
  onModelTouched: Function = () => {};
  @Input() label: string;
  @Input() isMultiple: boolean = false;
  @Input() options: string[];
  ngControl: NgControl;

  constructor(private inj: Injector) {}

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
    this.onModelChange(this.options[this.options.length - 1]);
  }

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  defaultSelectedOption() {
    if (this.isMultiple) {
      if (this.ngControl.value !== "") {
        let selectedOptions = [];
        this.ngControl.value.forEach((option) => {
          selectedOptions.push(this.options.indexOf(option));
        });
        return selectedOptions;
      }
    } else {
      if (this.ngControl.value !== "")
        return this.options.indexOf(this.ngControl.value);
    }
    return 0;
  }

  onSelect(event: any): void {
    let res;
    if (this.isMultiple) {
      res = [];
      const selectedOptions: HTMLCollection = event.target.selectedOptions;
      let index = 0;
      const selectedOptionsLength = selectedOptions.length;
      for (index; index < selectedOptionsLength; index++) {
        res.push(selectedOptions[index].textContent);
      }
    } else {
      res = event.target.value;
    }
    this.onModelChange(res);
  }
}
