import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  BASE_API_URL = '/api';
  LOGIN_API_URL = '/login';

  USUARIO_API_URL = '/usuarios';
  ENTIDADE_API_URL = '/entidades';
  PROFISSAO_API_URL = '/profissoes';

}
