import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardPageLayoutComponent } from './wizard-page-layout.component';

describe('WizardPageLayoutComponent', () => {
  let component: WizardPageLayoutComponent;
  let fixture: ComponentFixture<WizardPageLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardPageLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardPageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
