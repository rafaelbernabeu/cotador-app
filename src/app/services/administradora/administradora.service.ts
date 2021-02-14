import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Entidade} from '../entidade/entidade';
import {Administradora} from './administradora';

@Injectable({
  providedIn: 'root'
})
export class AdministradoraService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllAdministradoras(): Observable<Administradora[]> {
    return this.http.get<Administradora[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  public adicionarAdministradora(administradora: Administradora): Observable<Administradora> {
    return this.http.post<Administradora>(this.getApiUrl(), administradora, this.authServie.getTokenHeader());
  }

  public editarAdministradora(administradora: Administradora): Observable<Administradora> {
    return this.http.put<Administradora>(this.getApiUrl() + '/' + administradora.id, administradora, this.authServie.getTokenHeader());
  }

  public excluirAdministradora(administradora: Administradora): Observable<Entidade> {
    return this.http.delete<Entidade>(this.getApiUrl() + '/' + administradora.id, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.ADMINISTRADORA_API_URL;
  }
}
