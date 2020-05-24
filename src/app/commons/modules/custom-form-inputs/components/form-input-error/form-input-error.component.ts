import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-input-error',
  templateUrl: './form-input-error.component.html',
  styleUrls: ['./form-input-error.component.css']
})
export class FormInputErrorComponent implements OnInit {

  @Input() errors:any

  constructor() { }

  ngOnInit() {
    console.log(this.errors)
  }

  x(){
    console.log(this.errors)
  }
}
