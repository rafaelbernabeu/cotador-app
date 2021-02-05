import { Injectable } from '@angular/core';
import {Usuario} from '../../components/usuario/usuario';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
  ) { }

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>('/api/usuario',  this.authServie.getTokenHeader());
}
}
