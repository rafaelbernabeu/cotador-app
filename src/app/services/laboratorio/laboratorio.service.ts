import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Laboratorio} from './laboratorio';

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllLaboratorios(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  public adicionarLaboratorio(laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(this.getApiUrl(), laboratorio, this.authServie.getTokenHeader());
  }

  public editarLaboratorio(laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(this.getApiUrl() + '/' + laboratorio.id, laboratorio, this.authServie.getTokenHeader());
  }

  public excluirLaboratorio(laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http.delete<Laboratorio>(this.getApiUrl() + '/' + laboratorio.id, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.LABORATORIO_API_URL;
  }

}
