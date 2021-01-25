import { Router } from '@angular/router';
import { Injectable, EventEmitter } from '@angular/core';

import { Usuario } from './usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import {Token} from './token';

@Injectable()
export class AuthService {

  private usuarioAutenticado = false;
  private tokenUsuario: string;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  fazerLogin(usuario: Usuario): Observable<boolean> {
    this.usuarioAutenticado = false;
    return new Observable(observer => {
      this.http.get<Token>('/api/login', this.getAuthHeaders(usuario)).subscribe(
        data => {
          if (data.token) {
            this.tokenUsuario = data.token;
            this.usuarioAutenticado = true;
            console.log(this.tokenUsuario);
            observer.next(this.usuarioAutenticado);
          }
        },
        erro => {
          this.usuarioAutenticado = false;
          observer.error('dados nao conferem');
        }
      );
    });
  }

  public usuarioEstaAutenticado(): boolean {
    return this.usuarioAutenticado;
  }

  private getAuthHeaders(usuario: Usuario): object {
    return {
      headers: new HttpHeaders({ Authorization: 'Basic ' + btoa(usuario.email + ':' + usuario.password) })
    };
  }

  private getTokenHeaders(usuario: Usuario): object {
    if (!this.tokenUsuario) {
      this.router.navigate(['/login']);
    } else {
      return {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.tokenUsuario })
      };
    }
  }
}
