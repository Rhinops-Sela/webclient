import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControlErrorShowComponent } from './form-control-error-show.component';

describe('FormControlErrorShowComponent', () => {
  let component: FormControlErrorShowComponent;
  let fixture: ComponentFixture<FormControlErrorShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormControlErrorShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormControlErrorShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
