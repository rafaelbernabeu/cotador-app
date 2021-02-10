import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  LOGIN_API_URL = '/api/login';
  USUARIO_API_URL = '/api/usuario';
  ENTIDADE_API_URL = '/api/entidade';

}
