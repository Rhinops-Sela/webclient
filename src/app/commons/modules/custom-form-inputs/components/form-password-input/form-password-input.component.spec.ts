import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPasswordInputComponent } from './form-password-input.component';

describe('FormPasswordInputComponent', () => {
  let component: FormPasswordInputComponent;
  let fixture: ComponentFixture<FormPasswordInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPasswordInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPasswordInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
