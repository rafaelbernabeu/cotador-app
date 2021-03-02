import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Operadora} from './operadora';
import {Produto} from '../produto/produto';

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
