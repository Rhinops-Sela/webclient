import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardPageHeaderComponent } from './wizard-page-header.component';

describe('WizardPageHeaderComponent', () => {
  let component: WizardPageHeaderComponent;
  let fixture: ComponentFixture<WizardPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardPageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
