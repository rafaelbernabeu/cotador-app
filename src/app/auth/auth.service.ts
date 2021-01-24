import { Router } from '@angular/router';
import { Injectable, EventEmitter } from '@angular/core';

import { Usuario } from './usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  private usuarioAutenticado = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  private criaUrlLogin(usuario: Usuario) {
    return `oauth/token?grant_type=password&username=${usuario.email}&password=${usuario.senha}`;
  }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({ Authorization: 'Basic Y2xpZW50OjEyMw==' })
    };
  }

  async fazerLogin(usuario: Usuario) {
    this.usuarioAutenticado = false;

    // this.token = await this.http.post(this.criaUrlLogin(usuario), null, this.getAuthHeaders()).toPromise() as Token;

    // if (this.token != null) {
    //
    //   console.log(this.token);
    //   this.usuarioAutenticado = true;
    //   this.router.navigate(['/user']);
    //
    // } else {
    //
    //   console.log('Dados nao conferem!');
    //   this.usuarioAutenticado = false;
    //   usuario.senha = '';
    //
    // }
  }

  public usuarioEstaAutenticado(): boolean {
    return this.usuarioAutenticado;
  }

  // public getHeaders() {
  //   return {
  //     headers: new HttpHeaders({ Authorization: 'Bearer ' + this.getAccessToken() })
  //   };
  // }

}
