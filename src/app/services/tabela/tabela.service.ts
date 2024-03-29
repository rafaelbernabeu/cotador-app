import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Tabela} from './tabela';
import {Categoria} from '../categoria/categoria';
import {Operadora} from '../operadora/operadora';
import {Administradora} from '../administradora/administradora';
import {Estado} from '../estado/estado';
import {Produto} from '../produto/produto';

@Injectable({
  providedIn: 'root'
})
export class TabelaService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllTabelas(): Observable<Tabela[]> {
    return this.http.get<Tabela[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  public getProdutosByTabelaAndOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI(tabela: Tabela, operadora: Operadora, administradora: Administradora, estado: Estado, categoria: Categoria, mei: boolean): Observable<Produto[]> {
    let httpParams = new HttpParams()
      .append('estado', estado.sigla)
      .append('categoria', categoria.toString())
      .append('operadora', operadora.id.toString());

    if (administradora) {
      httpParams = httpParams.append('administradora', administradora.id.toString());
    }

    if (mei != null) {
      httpParams = httpParams.append('mei', '' + mei);
    }

    return this.http.get<Produto[]>(this.getApiUrl() + '/' + tabela.id + this.api.PRODUTO_API_URL, {
      headers: this.authServie.getTokenHeader().headers,
      params: httpParams
    });
  }

  public adicionarTabela(tabela: Tabela): Observable<Tabela> {
    return this.http.post<Tabela>(this.getApiUrl(), tabela, this.authServie.getTokenHeader());
  }

  public editarTabela(tabela: Tabela): Observable<Tabela> {
    return this.http.put<Tabela>(this.getApiUrl() + '/' + tabela.id, tabela, this.authServie.getTokenHeader());
  }

  public excluirTabela(tabela: Tabela): Observable<Tabela> {
    return this.http.delete<Tabela>(this.getApiUrl() + '/' + tabela.id, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.TABELA_API_URL;
  }
}
