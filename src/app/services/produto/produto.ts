import {Operadora} from '../operadora/operadora';
import {Coparticipacao} from '../coparticipacao/coparticipacao';
import {Laboratorio} from '../laboratorio/laboratorio';
import {Hospital} from '../hospital/hospital';

export class Produto {

  id: number;
  nome: string;
  ativo: boolean;
  reembolso: number;
  abrangencia: string;
  hospitais: Hospital[] = [];
  laboratorios: Laboratorio[] = [];
  operadora: Operadora = new Operadora();
  coparticipacao: Coparticipacao = new Coparticipacao();
  selected: boolean;

}
