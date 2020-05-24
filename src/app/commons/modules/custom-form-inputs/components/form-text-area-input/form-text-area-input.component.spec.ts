import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTextAreaInputComponent } from './form-text-area-input.component';

describe('FormTextAreaInputComponent', () => {
  let component: FormTextAreaInputComponent;
  let fixture: ComponentFixture<FormTextAreaInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTextAreaInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTextAreaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
