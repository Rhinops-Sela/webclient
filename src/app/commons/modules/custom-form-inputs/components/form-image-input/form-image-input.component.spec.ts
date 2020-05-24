import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormImageInputComponent } from './form-image-input.component';

describe('FormImageInputComponent', () => {
  let component: FormImageInputComponent;
  let fixture: ComponentFixture<FormImageInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormImageInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormImageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
