import { TestBed } from '@angular/core/testing';

import { FormProviderService } from './form-provider.service';

describe('FormProviderService', () => {
  let service: FormProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
