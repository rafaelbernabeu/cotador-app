import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Entidade} from '../entidade/entidade';
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

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.PROFISSAO_API_URL;
  }

}
