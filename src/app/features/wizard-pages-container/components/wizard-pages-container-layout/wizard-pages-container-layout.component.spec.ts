import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardPagesContainerLayoutComponent } from './wizard-pages-container-layout.component';

describe('WizardPagesContainerLayoutComponent', () => {
  let component: WizardPagesContainerLayoutComponent;
  let fixture: ComponentFixture<WizardPagesContainerLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardPagesContainerLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardPagesContainerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
