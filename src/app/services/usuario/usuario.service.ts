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
    return this.http.get<Usuario[]>(this.api.USUARIO_API_URL,  this.authServie.getTokenHeader());
  }
}
