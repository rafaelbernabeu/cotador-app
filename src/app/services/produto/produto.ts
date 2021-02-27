import {Operadora} from '../operadora/operadora';
import {Coparticipacao} from '../coparticipacao/coparticipacao';
import {Laboratorio} from '../laboratorio/laboratorio';
import {Hospital} from '../hospital/hospital';

export class Produto {

  id: number;
  nome: string;
  ativo: boolean;
  abrangencia: string;
  operadora: Operadora;
  reembolso: number;
  coparticipacoes: Coparticipacao[];
  laboratorios: Laboratorio[];
  hospitais: Hospital[];

}
