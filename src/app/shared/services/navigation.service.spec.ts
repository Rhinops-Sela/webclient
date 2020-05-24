import { TestBed } from '@angular/core/testing';

import { NavigateService } from './navigation.service';

describe('NavigationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavigateService = TestBed.get(NavigateService);
    expect(service).toBeTruthy();
  });
});
