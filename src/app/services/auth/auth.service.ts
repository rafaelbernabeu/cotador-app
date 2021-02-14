import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from './token';
import { ApiService } from '../api/api.service';
import { Usuario } from '../usuario/usuario';

@Injectable()
export class AuthService {

  private tokenUsuario: string;
  private usuarioAutenticado = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private http: HttpClient,
  ) { this.existeTokenStorage(); }

  fazerLogin(usuario: Usuario): Observable<boolean> {
    this.usuarioAutenticado = false;
    return new Observable(observer => {
      this.http.get<Token>(this.getLoginUrl(), this.getAuthHeaders(usuario)).subscribe(
        data => {
          if (data.token) {
            localStorage.setItem('token', data.token);
            this.tokenUsuario = data.token;
            this.usuarioAutenticado = true;
            console.log(this.tokenUsuario);
            observer.next(this.usuarioAutenticado);
          }
        },
        erro => {
          this.usuarioAutenticado = false;
          observer.error();
        }
      );
    });
  }

  public existeTokenStorage(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      this.tokenUsuario = token;
      this.usuarioAutenticado = true;
    }
    return this.usuarioAutenticado;
  }

  public isUsuarioAutenticado(): boolean {
    return this.usuarioAutenticado;
  }

  private getAuthHeaders(usuario: Usuario): object {
    return {
      headers: new HttpHeaders({ Authorization: 'Basic ' + btoa(usuario.email + ':' + usuario.password) })
    };
  }

  private getLoginUrl(): string {
    return this.api.BASE_API_URL + this.api.LOGIN_API_URL;
  }

  public getTokenHeader(): object {
    if (!this.tokenUsuario) {
      this.router.navigate(['/login']);
    } else {
      return {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.tokenUsuario })
      };
    }
  }
}
