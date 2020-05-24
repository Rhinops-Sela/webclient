import { Component, OnInit, forwardRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Component({
  selector: "app-form-number-input",
  templateUrl: "./form-number-input.component.html",
  styleUrls: ["./form-number-input.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormNumberInputComponent),
      multi: true
    }
  ]
})
export class FormNumberInputComponent implements ControlValueAccessor, OnInit {
  ngOnInit(): void {}

  onModelChange: Function = (value: any) => {};
  onModelTouched: Function = () => {};
  @Input() label: string;
  @Input() placeholder: string;
  @Input() disable: boolean = false;
  value:number = null;

  constructor() {}
  writeValue(value: number) {
    this.value = value;
  }

  registerOnChange(fn: Function) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onModelTouched = fn;
  }
}
