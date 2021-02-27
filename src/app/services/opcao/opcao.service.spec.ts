import { TestBed } from '@angular/core/testing';

import { OpcaoService } from './opcao.service';

describe('OpcaoService', () => {
  let service: OpcaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpcaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
