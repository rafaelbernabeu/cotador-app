import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Categoria} from './categoria';
import {Estado} from '../estado/estado';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  public getEstadosByCategoria(categoria: Categoria): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.getApiUrl() + '/' + categoria + this.api.ESTADO_API_URL, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.CATEGORIA_API_URL;
  }
}
