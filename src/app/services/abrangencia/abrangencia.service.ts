import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Abrangencia} from './abrangencia';

@Injectable({
  providedIn: 'root'
})
export class AbrangenciaService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllAbrangencias(): Observable<Abrangencia[]> {
    return this.http.get<Abrangencia[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.ABRANGENCIA_API_URL;
  }
}
