import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Acomodacao} from './Acomodacao';

@Injectable({
  providedIn: 'root'
})
export class AcomodacaoService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllAcomodacoes(): Observable<Acomodacao[]> {
    return this.http.get<Acomodacao[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.ACOMODACAO_API_URL;
  }

}
