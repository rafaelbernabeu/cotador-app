import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Produto} from '../produto/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  public adicionarProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.getApiUrl(), produto, this.authServie.getTokenHeader());
  }

  public editarProduto(produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(this.getApiUrl() + '/' + produto.id, produto, this.authServie.getTokenHeader());
  }

  public excluirProduto(produto: Produto): Observable<Produto> {
    return this.http.delete<Produto>(this.getApiUrl() + '/' + produto.id, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.PRODUTO_API_URL;
  }
}
