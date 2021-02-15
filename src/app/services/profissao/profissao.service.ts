import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Profissao} from './profissao';

@Injectable({
  providedIn: 'root'
})
export class ProfissaoService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllProfissoes(): Observable<Profissao[]> {
    return this.http.get<Profissao[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  public adicionarProfissao(laboratorio: Profissao): Observable<Profissao> {
    return this.http.post<Profissao>(this.getApiUrl(), laboratorio, this.authServie.getTokenHeader());
  }

  public editarProfissao(laboratorio: Profissao): Observable<Profissao> {
    return this.http.put<Profissao>(this.getApiUrl() + '/' + laboratorio.id, laboratorio, this.authServie.getTokenHeader());
  }

  public excluirProfissao(laboratorio: Profissao): Observable<Profissao> {
    return this.http.delete<Profissao>(this.getApiUrl() + '/' + laboratorio.id, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.PROFISSAO_API_URL;
  }

}
