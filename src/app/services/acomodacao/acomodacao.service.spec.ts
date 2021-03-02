import { TestBed } from '@angular/core/testing';

import { AcomodacaoService } from './acomodacao.service';

describe('AcomodacaoService', () => {
  let service: AcomodacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcomodacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
