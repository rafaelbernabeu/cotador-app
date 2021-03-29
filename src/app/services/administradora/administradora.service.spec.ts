import {TestBed} from '@angular/core/testing';

import {AdministradoraService} from './administradora.service';

describe('AdministradoraService', () => {
  let service: AdministradoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministradoraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
