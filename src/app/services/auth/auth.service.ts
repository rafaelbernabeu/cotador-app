import { Router } from '@angular/router';
import { Injectable, EventEmitter } from '@angular/core';

import { Login } from '../../components/login/login';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { Token } from './token';
import {ApiService} from '../api/api.service';

@Injectable()
export class AuthService {

  private usuarioAutenticado = false;
  private tokenUsuario: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  fazerLogin(login: Login): Observable<boolean> {
    this.usuarioAutenticado = false;
    return new Observable(observer => {
      this.http.get<Token>(this.api.LOGIN_API_URL, this.getAuthHeaders(login)).subscribe(
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

  private getAuthHeaders(login: Login): object {
    return {
      headers: new HttpHeaders({ Authorization: 'Basic ' + btoa(login.email + ':' + login.password) })
    };
  }

  public getTokenHeader(): object {
    if (!this.tokenUsuario) {
      this.router.navigate(['login']);
    } else {
      return {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.tokenUsuario })
      };
    }
  }
}
