import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardPageInfoComponent } from './wizard-page-info.component';

describe('WizardPageInfoComponent', () => {
  let component: WizardPageInfoComponent;
  let fixture: ComponentFixture<WizardPageInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardPageInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardPageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
