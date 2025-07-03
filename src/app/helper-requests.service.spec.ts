import { TestBed } from '@angular/core/testing';

import { HelperRequestsService } from './helper-requests.service';

describe('HelperRequestsService', () => {
  let service: HelperRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelperRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
