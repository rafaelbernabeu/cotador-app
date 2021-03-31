import {Administradora} from '../administradora/administradora';
import {Estado} from '../estado/estado';
import {Categoria} from '../categoria/categoria';
import {Operadora} from '../operadora/operadora';
import {Profissao} from "../profissao/profissao";

export class FiltroTabela {

  nome: string = '';
  tipoFiltro: string;
  idadeMinima: number;
  idadeMaxima: number;
  qtdMinVidas: number;
  compulsoria: boolean;
  livreAdesao: boolean;
  contemplaMEI: boolean;
  preferencial: boolean;
  qtdMinTitulares: number;
  categoria: Categoria;

  estados: Estado[] = [];
  reajustes: string[] = [];
  operadoras: Operadora[] = [];
  profissoes: Profissao[] = [];
  administradoras: Administradora[] = [];


}
