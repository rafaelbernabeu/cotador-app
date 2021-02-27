import { TestBed } from '@angular/core/testing';

import { CoparticipacaoService } from './coparticipacao.service';

describe('CoparticipacaoService', () => {
  let service: CoparticipacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoparticipacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
