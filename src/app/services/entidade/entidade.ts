import {Profissao} from '../profissao/profissao';

export class Entidade {

  id: number;
  nome: string;
  observacoes: string;
  documentacao: string;
  valorAssociacao: string;
  profissoes: Profissao[];
  selected: boolean;

}
