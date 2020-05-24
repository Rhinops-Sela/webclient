import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNumberInputComponent } from './form-number-input.component';

describe('FormNumberInputComponent', () => {
  let component: FormNumberInputComponent;
  let fixture: ComponentFixture<FormNumberInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormNumberInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
