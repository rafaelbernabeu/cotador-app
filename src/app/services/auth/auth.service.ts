import {ActivatedRoute, Router} from '@angular/router';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '../token/token';
import { ApiService } from '../api/api.service';
import { Usuario } from '../usuario/usuario';
import {TokenService} from '../token/token.service';

@Injectable()
export class AuthService {

  private usuarioAutenticado = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private http: HttpClient,
    private tokenService: TokenService,
  ) { this.tentaCarregarTokenLocalStorage(); }

  fazerLogin(usuario: Usuario): Observable<boolean> {
    this.usuarioAutenticado = false;
    return new Observable(observer => {
      this.http.get<Token>(this.getLoginUrl(), this.getBasicAuthHeader(usuario)).subscribe(
        data => {
          if (data.token) {
            this.tokenService.setTokenUsuario(data.token);
            this.usuarioAutenticado = true;
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

  private tentaCarregarTokenLocalStorage(): boolean {
    if (this.tokenService.tentaCarregarTokenLocalStorage()) {
      this.usuarioAutenticado = true;
    }
    return this.usuarioAutenticado;
  }

  public isUsuarioAutenticado(): boolean {
    if (!this.usuarioAutenticado || !this.tokenService.isTokenValido()) {
      if (!(this.router.url === '/login')) {
        this.router.navigate(['/login']);
      }
      return false;
    }
    return true;
  }

  private getBasicAuthHeader(usuario: Usuario): object {
    return {
      headers: new HttpHeaders({ Authorization: 'Basic ' + btoa(usuario.email + ':' + usuario.password) })
    };
  }

  public getTokenHeader(): object {
    if (this.isUsuarioAutenticado()) {
      return {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.tokenService.getTokenUsuario() })
      };
    }
    throw new Error('Usuario nao autenticado ou token expirado.');
  }

  private getLoginUrl(): string {
    return this.api.BASE_API_URL + this.api.LOGIN_API_URL;
  }

}
