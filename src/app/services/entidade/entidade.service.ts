import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Entidade} from './entidade';
import {ApiService} from '../api/api.service';
import {Profissao} from '../profissao/profissao';

@Injectable({
  providedIn: 'root'
})
export class EntidadeService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllEntidades(): Observable<Entidade[]> {
    return this.http.get<Entidade[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  public getProfissoesByEntidade(entidade: Entidade): Observable<Profissao[]> {
    return this.http.get<Profissao[]>(this.getApiUrl() + '/' + entidade.id + this.api.PROFISSAO_API_URL, this.authServie.getTokenHeader());
  }

  public atualizarProfissoesDaEntidade(entidade: Entidade, profissoes: Profissao[]): Observable<Profissao[]> {
    return this.http.post<Profissao[]>(this.getApiUrl() + '/' + entidade.id + this.api.PROFISSAO_API_URL, profissoes, this.authServie.getTokenHeader());
  }

  public adicionarEntidade(entidade: Entidade): Observable<Entidade> {
    return this.http.post<Entidade>(this.getApiUrl(), entidade, this.authServie.getTokenHeader());
  }

  public editarEntidade(entidade: Entidade): Observable<Entidade> {
    return this.http.put<Entidade>(this.getApiUrl() + '/' + entidade.id, entidade, this.authServie.getTokenHeader());
  }

  public excluirEntidade(entidade: Entidade): Observable<Entidade> {
    return this.http.delete<Entidade>(this.getApiUrl() + '/' + entidade.id, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.ENTIDADE_API_URL;
  }
}
