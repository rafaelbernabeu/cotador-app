import {Administradora} from '../administradora/administradora';
import {Produto} from '../produto/produto';
import {Opcao} from '../opcao/opcao';
import {Entidade} from '../entidade/entidade';
import {Estado} from '../estado/estado';
import {Categoria} from '../categoria/categoria';
import {Operadora} from '../operadora/operadora';

export class Tabela {

  id: number;
  nome: string = '';
  contemplaMEI: boolean;
  compulsoria: boolean;
  idadeMinima: number;
  idadeMaxima: number;
  qtdMinVidas: number;
  qtdMinTitulares: number;
  preferencial: boolean;
  reajuste: string;

  estado: Estado = new Estado();
  categoria: Categoria = new Categoria();
  operadora: Operadora = new Operadora();
  administradora: Administradora = new Administradora();

  opcao: Opcao[];
  produtos: Produto[];
  entidades: Entidade[];

}
