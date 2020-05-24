import { Component, OnInit, forwardRef, Input, Injector } from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NgControl,
} from "@angular/forms";

@Component({
  selector: "app-form-checkbox-input",
  templateUrl: "./form-checkbox-input.component.html",
  styleUrls: ["./form-checkbox-input.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCheckboxInputComponent),
      multi: true,
    },
  ],
})
export class FormCheckboxInputComponent
  implements ControlValueAccessor, OnInit {
  onModelChange: Function = (value: any) => {};
  onModelTouched: Function = () => {};
  @Input() label: string;
  value = false;
  ngControl: NgControl;
  constructor(private inj: Injector) {}

  ngOnInit(): void {
  }

  defaultChecked() {
    this.ngControl = this.inj.get(NgControl);
    this.value = this.ngControl.value? true : false;
    return this.value;
  }
  writeValue(value: string) {
    this.onModelChange(this.value);
  }

  registerOnChange(fn: Function) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onModelTouched = fn;
  }
  onChange(value: any) {
    this.value = value;
    this.onModelChange(this.value);
  }
}
