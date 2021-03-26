import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Operadora} from './operadora';
import {Produto} from '../produto/produto';
import {Administradora} from '../administradora/administradora';
import {Estado} from '../estado/estado';
import {Categoria} from '../categoria/categoria';
import {Tabela} from '../tabela/tabela';

@Injectable({
  providedIn: 'root'
})
export class OperadoraService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllOperadoras(): Observable<Operadora[]> {
    return this.http.get<Operadora[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  public getProdutosByOperadora(operadora: Operadora): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.getApiUrl() + '/' + operadora.id + this.api.PRODUTO_API_URL, this.authServie.getTokenHeader());
  }

  public getTabelasByOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI(operadora: Operadora, administradora: Administradora, estado: Estado, categoria: Categoria, mei: boolean): Observable<Tabela[]> {
    return this.http.get<Tabela[]>(this.getApiUrl() + '/' + operadora.id + this.api.TABELA_API_URL, {
      headers: this.authServie.getTokenHeader().headers,
      params: new HttpParams()
        .append('administradora', administradora.id.toString())
        .append('estado', estado.sigla)
        .append('categoria', categoria.toString())
        .append('mei', '' + mei)
    });
  }

  public getTabelasByOperadoraAndEstadoAndCategoriaAndMEI(operadora: Operadora, estado: Estado, categoria: Categoria, mei: boolean): Observable<Tabela[]> {
    return this.http.get<Tabela[]>(this.getApiUrl() + '/' + operadora.id + this.api.TABELA_API_URL, {
      headers: this.authServie.getTokenHeader().headers,
      params: new HttpParams()
        .append('estado', estado.sigla)
        .append('categoria', categoria.toString())
        .append('mei', '' + mei)
    });
  }

  public adicionarOperadora(operadora: Operadora): Observable<Operadora> {
    return this.http.post<Operadora>(this.getApiUrl(), operadora, this.authServie.getTokenHeader());
  }

  public editarOperadora(operadora: Operadora): Observable<Operadora> {
    return this.http.put<Operadora>(this.getApiUrl() + '/' + operadora.id, operadora, this.authServie.getTokenHeader());
  }

  public excluirOperadora(operadora: Operadora): Observable<Operadora> {
    return this.http.delete<Operadora>(this.getApiUrl() + '/' + operadora.id, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.OPERADORA_API_URL;
  }
}
