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
  ESTADO_API_URL = '/estados';
  USUARIO_API_URL = '/usuarios';
  PRODUTO_API_URL = '/produtos';
  ENTIDADE_API_URL = '/entidades';
  HOSPITAL_API_URL = '/hospitais';
  REAJUSTE_API_URL = '/reajustes';
  CATEGORIA_API_URL = '/categorias';
  PROFISSAO_API_URL = '/profissoes';
  OPERADORA_API_URL = '/operadoras';
  ACOMODACAO_API_URL = '/acomodacoes';
  ABRANGENCIA_API_URL = '/abrangencias';
  LABORATORIO_API_URL = '/laboratorios';
  ADMINISTRADORA_API_URL = '/administradoras';

}
