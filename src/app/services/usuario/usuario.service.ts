import { Injectable } from '@angular/core';
import {Usuario} from './usuario';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {ApiService} from '../api/api.service';
import {Profissao} from '../profissao/profissao';
import {Role} from '../role/role';

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

  public getRolesByUsuario(usuario: Usuario): Observable<Role[]> {
    return this.http.get<Role[]>(this.getApiUrl() + '/' + usuario.id + this.api.ROLE_API_URL, this.authServie.getTokenHeader());
  }

  public atualizarRolesDoUsuario(usuario: Usuario, roles: Role[]): Observable<Role[]> {
    return this.http.post<Role[]>(this.getApiUrl() + '/' + usuario.id + this.api.ROLE_API_URL,
      roles, this.authServie.getTokenHeader());
  }

  public adicionarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.getApiUrl(), usuario, this.authServie.getTokenHeader());
  }

  public editarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(this.getApiUrl() + '/' + usuario.id, usuario, this.authServie.getTokenHeader());
  }

  public excluirUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.delete<Usuario>(this.getApiUrl() + '/' + usuario.id, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.USUARIO_API_URL;
  }

}
