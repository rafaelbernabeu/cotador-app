import {Administradora} from '../administradora/administradora';
import {Produto} from '../produto/produto';
import {Entidade} from '../entidade/entidade';
import {Estado} from '../estado/estado';
import {Categoria} from '../categoria/categoria';
import {Operadora} from '../operadora/operadora';

export class Tabela {

  id: number;
  nome: string = '';
  reajuste: string;
  idadeMinima: number;
  idadeMaxima: number;
  qtdMinVidas: number;
  qtdMinTitulares: number;
  compulsoria: boolean = false;
  livreAdesao: boolean = false;
  contemplaMEI: boolean = false;

  estado: Estado = new Estado();
  categoria: Categoria = new Categoria();
  operadora: Operadora = new Operadora();
  administradora: Administradora = new Administradora();

  produtos: Produto[];
  entidades: Entidade[];

}
