import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {Usuario} from '../usuario/usuario';
import {Observable} from 'rxjs';
import {Entidade} from './entidade';
import {ApiService} from '../api/api.service';

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
    return this.http.get<Entidade[]>(this.api.ENTIDADE_API_URL, this.authServie.getTokenHeader());
  }
}
