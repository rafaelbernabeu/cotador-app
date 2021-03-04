import {Profissao} from '../profissao/profissao';

export class Entidade {

  id: number;
  nome: string;
  profissoes: Profissao[];
  selected: boolean;

}
