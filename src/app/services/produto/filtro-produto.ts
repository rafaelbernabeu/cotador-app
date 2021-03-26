import {Operadora} from '../operadora/operadora';
import {Coparticipacao} from '../coparticipacao/coparticipacao';
import {Laboratorio} from '../laboratorio/laboratorio';
import {Hospital} from '../hospital/hospital';

export class FiltroProduto {

  nome: string = '';
  ativo: boolean;
  reembolso: number;
  tipoFiltro: string;
  abrangencia: string;
  hospitais: Hospital[] = [];
  operadoras: Operadora[] = [];
  laboratorios: Laboratorio[] = [];
  coparticipacao: Coparticipacao = new Coparticipacao();
  observacao: string;

}
