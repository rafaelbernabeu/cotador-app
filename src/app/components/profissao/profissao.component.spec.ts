import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfissaoComponent} from './profissao.component';

describe('ProfissaoComponent', () => {
  let component: ProfissaoComponent;
  let fixture: ComponentFixture<ProfissaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfissaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
