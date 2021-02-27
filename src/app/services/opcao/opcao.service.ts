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

  public adicionarOpcao(opcao: Opcao): Observable<Opcao> {
    return this.http.post<Opcao>(this.getApiUrl(), opcao, this.authServie.getTokenHeader());
  }

  public editarOpcao(opcao: Opcao): Observable<Opcao> {
    return this.http.put<Opcao>(this.getApiUrl() + '/' + opcao.id, opcao, this.authServie.getTokenHeader());
  }

  public excluirOpcao(opcao: Opcao): Observable<Opcao> {
    return this.http.delete<Opcao>(this.getApiUrl() + '/' + opcao.id, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.OPCAO_API_URL;
  }

}
