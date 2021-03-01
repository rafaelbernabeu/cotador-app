import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  BASE_API_URL = '/api';
  LOGIN_API_URL = '/login';

  ROLE_API_URL = '/roles';
  OPCAO_API_URL = '/opcoes';
  TABELA_API_URL = '/tabela';
  USUARIO_API_URL = '/usuarios';
  PRODUTO_API_URL = '/produtos';
  ENTIDADE_API_URL = '/entidades';
  HOSPITAL_API_URL = '/hospitais';
  PROFISSAO_API_URL = '/profissoes';
  OPERADORA_API_URL = '/operadoras';
  LABORATORIO_API_URL = '/laboratorios';
  ADMINISTRADORA_API_URL = '/administradoras';

  ESTADO_API_URL = '/enums/estados';
  CATEGORIA_API_URL = '/enums/categorias';
  ABRANGENCIA_API_URL = '/enums/abrangencias';

}
