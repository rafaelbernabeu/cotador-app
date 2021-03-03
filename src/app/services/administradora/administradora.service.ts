import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Administradora} from './administradora';
import {Estado} from '../estado/estado';
import {Categoria} from '../categoria/categoria';
import {Operadora} from '../operadora/operadora';

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

  public getOperadorasByAdministradoraAndEstadoAndCategoriaAndMEI(administradora: Administradora, estado: Estado, categoria: Categoria, contemplaMEI: boolean): Observable<Operadora[]> {
    return this.http.get<Operadora[]>(this.getApiUrl() + '/' + administradora.id + this.api.OPERADORA_API_URL, {
        headers: this.authServie.getTokenHeader().headers,
        params: new HttpParams()
          .append('estado', estado.sigla)
          .append('categoria', categoria.toString())
          .append('mei', '' + contemplaMEI)
      }
    );
  }

  public adicionarAdministradora(administradora: Administradora): Observable<Administradora> {
    return this.http.post<Administradora>(this.getApiUrl(), administradora, this.authServie.getTokenHeader());
  }

  public editarAdministradora(administradora: Administradora): Observable<Administradora> {
    return this.http.put<Administradora>(this.getApiUrl() + '/' + administradora.id, administradora, this.authServie.getTokenHeader());
  }

  public excluirAdministradora(administradora: Administradora): Observable<Administradora> {
    return this.http.delete<Administradora>(this.getApiUrl() + '/' + administradora.id, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.ADMINISTRADORA_API_URL;
  }
}
