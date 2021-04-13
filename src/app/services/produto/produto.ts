import {Operadora} from '../operadora/operadora';
import {Coparticipacao} from '../coparticipacao/coparticipacao';
import {Laboratorio} from '../laboratorio/laboratorio';
import {Hospital} from '../hospital/hospital';

export class Produto {

  id: number;
  nome: string = '';
  selected: boolean;
  reembolso: number;
  observacao: string;
  abrangencia: string;
  ativo: boolean = true;

  hospitais: Hospital[] = [];
  laboratorios: Laboratorio[] = [];
  operadora: Operadora = new Operadora();
  coparticipacao: Coparticipacao = new Coparticipacao();

}
