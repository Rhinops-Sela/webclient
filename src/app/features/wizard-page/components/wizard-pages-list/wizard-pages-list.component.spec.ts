import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardPagesListComponent } from './wizard-pages-list.component';

describe('WizardPagesListComponent', () => {
  let component: WizardPagesListComponent;
  let fixture: ComponentFixture<WizardPagesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardPagesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardPagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
