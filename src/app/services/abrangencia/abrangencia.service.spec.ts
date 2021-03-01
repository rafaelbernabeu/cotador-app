import { TestBed } from '@angular/core/testing';

import { AbrangenciaService } from './abrangencia.service';

describe('AbrangenciaService', () => {
  let service: AbrangenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbrangenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
