import {Tabela} from '../tabela/tabela';
import {Acomodacao} from '../acomodacao/Acomodacao';
import {Categoria} from '../categoria/categoria';
import {Produto} from '../produto/produto';
import {Estado} from "../estado/estado";
import {Administradora} from "../administradora/administradora";
import {Operadora} from "../operadora/operadora";
import {Abrangencia} from "../abrangencia/abrangencia";
import {Profissao} from "../profissao/profissao";
import {Reajuste} from "../reajuste/reajuste";

export class FiltroOpcao {

  id: number;
  mei: boolean;
  idadeMinima: number;
  idadeMaxima: number;
  reembolso: number;
  tipoFiltro: string;
  qtdMinVidas: number;
  qtdMinTitulares: number;
  coparticipacao: boolean;

  categoria: Categoria
  acomodacao: Acomodacao;
  abrangencia: Abrangencia;

  estados: Estado[] = [];
  tabelas: Tabela[] = [];
  produtos: Produto[] = [];
  reajustes: Reajuste[] = [];
  operadoras: Operadora[] = [];
  profissoes: Profissao[] = [];
  administradoras: Administradora[] = [];

}
