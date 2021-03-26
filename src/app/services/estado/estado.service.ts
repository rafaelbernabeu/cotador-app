import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Estado} from './estado';
import {Administradora} from '../administradora/administradora';
import {Categoria} from '../categoria/categoria';
import {Operadora} from "../operadora/operadora";

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  public getAdministradorasByEstadoAndCategoria(estado: Estado, categoria: Categoria): Observable<Administradora[]> {
    return this.http.get<Administradora[]>(this.getApiUrl() + '/' + estado.sigla + this.api.ADMINISTRADORA_API_URL, {
        headers: this.authServie.getTokenHeader().headers,
        params: new HttpParams().append('categoria', categoria.toString())
      }
    );
  }

  public getOperadorasByEstadoAndCategoriaAndMEI(estado: Estado, categoria: Categoria, contemplaMEI: boolean): Observable<Operadora[]> {
    return this.http.get<Operadora[]>(this.getApiUrl() + '/' + estado.sigla + this.api.OPERADORA_API_URL, {
        headers: this.authServie.getTokenHeader().headers,
        params: new HttpParams()
          .append('categoria', categoria.toString())
          .append('mei', '' + contemplaMEI)
      }
    );
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.ESTADO_API_URL;
  }
}
