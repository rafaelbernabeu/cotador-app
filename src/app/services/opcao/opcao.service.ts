import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Opcao} from './opcao';

@Injectable({
  providedIn: 'root'
})
export class OpcaoService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllOpcoes(): Observable<Opcao[]> {
    return this.http.get<Opcao[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  public adicionarOpcao(operadora: Opcao): Observable<Opcao> {
    return this.http.post<Opcao>(this.getApiUrl(), operadora, this.authServie.getTokenHeader());
  }

  public editarOpcao(operadora: Opcao): Observable<Opcao> {
    return this.http.put<Opcao>(this.getApiUrl() + '/' + operadora.id, operadora, this.authServie.getTokenHeader());
  }

  public excluirOpcao(operadora: Opcao): Observable<Opcao> {
    return this.http.delete<Opcao>(this.getApiUrl() + '/' + operadora.id, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.OPCAO_API_URL;
  }

}
