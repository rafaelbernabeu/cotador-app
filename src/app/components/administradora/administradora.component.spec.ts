import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdministradoraComponent} from './administradora.component';

describe('AdministradoraComponent', () => {
  let component: AdministradoraComponent;
  let fixture: ComponentFixture<AdministradoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministradoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
