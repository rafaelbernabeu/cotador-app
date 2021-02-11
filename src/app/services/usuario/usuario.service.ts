import { Injectable } from '@angular/core';
import {Usuario} from './usuario';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {ApiService} from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.USUARIO_API_URL;
  }

}
