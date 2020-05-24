import { Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-form-text-input",
  templateUrl: "./form-text-input.component.html",
  styleUrls: ["./form-text-input.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextInputComponent),
      multi: true
    }
  ]
})
export class FormTextInputComponent implements ControlValueAccessor {
  onModelChange: Function = (value: any) => {};
  onModelTouched: Function = () => {};
  @Input() label: string;
  @Input() placeholder: string;
  value = null;

  constructor() {}

  writeValue(value: string) {
    this.value = value;
  }

  registerOnChange(fn: Function) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onModelTouched = fn;
  }
}
