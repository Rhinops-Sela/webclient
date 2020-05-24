import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardPageFormComponent } from './wizard-page-form.component';

describe('WizardPageFormComponent', () => {
  let component: WizardPageFormComponent;
  let fixture: ComponentFixture<WizardPageFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardPageFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardPageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
