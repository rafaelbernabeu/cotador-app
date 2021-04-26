import {Router} from '@angular/router';
import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Token} from '../token/token';
import {ApiService} from '../api/api.service';
import {Usuario} from '../usuario/usuario';
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
      this.http.post<Token>(this.getLoginUrl(), usuario.geolocation, this.getBasicAuthHeader(usuario)).subscribe(
        data => {
          if (data.token) {
            this.tokenService.setToken(data.token);
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

  public getNomeUsuarioAutenticado(): string {
    return this.tokenService.getTokenObject().sub;
  }

  public getRolesUsuarioAutenticado(): string[] {
    return this.tokenService.getTokenObject().groups
  }

  public logout(): void {
    this.usuarioAutenticado = false;
    this.tokenService.limpar();
    this.router.navigate(['/login']);
  }

  isUsrAdmin(): boolean {
    return this.getRolesUsuarioAutenticado().some(r => r === 'ADMIN')
  }

  isUsrVendedor(): boolean {
    return this.getRolesUsuarioAutenticado().some(r => r === 'VENDEDOR')
  }

  isUsrOperador(): boolean {
    return this.getRolesUsuarioAutenticado().some(r => r === 'OPERADOR')
  }

  isUsrPosVendas(): boolean {
    return this.getRolesUsuarioAutenticado().some(r => r === 'POS-VENDAS')
  }

  public getTokenHeader(): {headers} {
    if (this.isUsuarioAutenticado()) {
      return {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.tokenService.getToken() })
      };
    }
    throw new Error('Usuario nao autenticado ou token expirado.');
  }

  private getBasicAuthHeader(usuario: Usuario): object {
    return {
      headers: new HttpHeaders({ Authorization: 'Basic ' + btoa(usuario.email + ':' + usuario.password) })
    };
  }

  private getLoginUrl(): string {
    return this.api.BASE_API_URL + this.api.LOGIN_API_URL;
  }

}
