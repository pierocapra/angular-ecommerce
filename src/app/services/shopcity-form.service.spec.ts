import { TestBed } from '@angular/core/testing';

import { ShopcityFormService } from './shopcity-form.service';

describe('ShopcityFormService', () => {
  let service: ShopcityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopcityFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
