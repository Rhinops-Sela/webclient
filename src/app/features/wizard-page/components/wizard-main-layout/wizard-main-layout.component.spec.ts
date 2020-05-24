import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardMainLayoutComponent } from './wizard-main-layout.component';

describe('WizardMainLayoutComponent', () => {
  let component: WizardMainLayoutComponent;
  let fixture: ComponentFixture<WizardMainLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardMainLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardMainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
