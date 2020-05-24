import { Component, OnInit, forwardRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Component({
  selector: "app-form-text-area-input",
  templateUrl: "./form-text-area-input.component.html",
  styleUrls: ["./form-text-area-input.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextAreaInputComponent),
      multi: true
    }
  ]
})
export class FormTextAreaInputComponent implements ControlValueAccessor {
  onModelChange: Function = (value: any) => {};
  onModelTouched: Function = () => {};
  @Input() label: string;
  @Input() placeholder: string;
  @Input() rows:number;
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
  onChange(event) {
    this.onModelChange(event.target.value);
  }
}
