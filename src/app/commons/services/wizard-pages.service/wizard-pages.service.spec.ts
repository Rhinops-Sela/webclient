import { TestBed } from '@angular/core/testing';

import { WizardPagesService } from './wizard-pages.service';

describe('WizardPagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WizardPagesService = TestBed.get(WizardPagesService);
    expect(service).toBeTruthy();
  });
});
