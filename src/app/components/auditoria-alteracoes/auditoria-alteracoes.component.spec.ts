import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuditoriaAlteracoesComponent} from './auditoria-alteracoes.component';

describe('AuditoriaAlteracoesComponent', () => {
  let component: AuditoriaAlteracoesComponent;
  let fixture: ComponentFixture<AuditoriaAlteracoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaAlteracoesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaAlteracoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
