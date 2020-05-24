import { Component, OnInit, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-form-password-input",
  templateUrl: "./form-password-input.component.html",
  styleUrls: ["./form-password-input.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormPasswordInputComponent),
      multi: true
    }
  ]
})
export class FormPasswordInputComponent implements ControlValueAccessor {
  @Input() placeholder: string;
  @Input() label: string;
  onChange: () => void;
  onTouched: () => void;
  value: string = null;
  disabled: boolean;

  constructor() {}

  ngOnInit() {}

  writeValue(value: string): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
   this.onChange = fn
  }
  registerOnTouched(fn: any): void {
   this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
   this.disabled = isDisabled;
  }
}
