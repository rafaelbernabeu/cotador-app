import { Injectable } from '@angular/core';
import {TokenJwt} from './token-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private token: TokenJwt;
  private rawToken: string;

  constructor() { }

  public getTokenUsuario(): string {
    return this.rawToken;
  }

  public setTokenUsuario(token: string): void {
    this.rawToken = token;
    localStorage.setItem('token', token);
    this.parseToken(token);
    console.log(this.token);
  }

  private parseToken(token: string): void {
    const jwtParts: string[] = token.split('.');
    this.token = Object.assign({},
      JSON.parse(atob(jwtParts[0])),
      JSON.parse(atob(jwtParts[1])),
    );
  }

  public isTokenValido(): boolean {
    const isValido = this.token.exp * 1000 > new Date().getTime();
    if (!isValido) {
      localStorage.clear();
    }
    return isValido;
  }

  public tentaCarregarTokenLocalStorage(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      this.parseToken(token);
      return this.isTokenValido();
    }
    return false;
  }
}
