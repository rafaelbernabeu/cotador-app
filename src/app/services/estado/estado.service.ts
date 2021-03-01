import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Estado} from './estado';

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

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.ESTADO_API_URL;
  }

}
