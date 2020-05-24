import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-form-input-date',
  templateUrl: './form-input-date.component.html',
  styleUrls: ['./form-input-date.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputDateComponent),
      multi: true
    }
  ]
})
export class FormInputDateComponent implements ControlValueAccessor, OnInit {
  onModelChange: Function = (value: any) => {};
  onModelTouched: Function = () => {};
  @Input() label: string;
  @Input() placeholder: string;
  @Input() disable: boolean = false;
  value = null;
  constructor() { }

  ngOnInit() {
  }
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
