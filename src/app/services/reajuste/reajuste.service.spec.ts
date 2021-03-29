import {TestBed} from '@angular/core/testing';

import {ReajusteService} from './reajuste.service';

describe('ReajusteService', () => {
  let service: ReajusteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReajusteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
