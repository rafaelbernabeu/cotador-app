import { Injectable } from '@angular/core';
import {TokenJwt} from './token-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private token: TokenJwt;
  private rawToken: string;

  constructor() { }

  public getToken(): string {
    return this.rawToken;
  }

  public getTokenObject(): TokenJwt {
    return {...this.token};
  }

  public setToken(token: string): void {
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
      this.limpar();
    }
    return isValido;
  }

  public tentaCarregarTokenLocalStorage(): boolean {
    this.rawToken = localStorage.getItem('token');
    if (this.rawToken) {
      this.parseToken(this.rawToken);
      return this.isTokenValido();
    }
    return false;
  }

  public limpar(): void {
    this.token = null;
    this.rawToken = null;
    localStorage.clear();
  }

}
