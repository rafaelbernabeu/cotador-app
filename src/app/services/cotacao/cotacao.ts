import {Profissao} from "../profissao/profissao";
import {Categoria} from "../categoria/categoria";
import {Entidade} from "../entidade/entidade";
import {Acomodacao} from "../acomodacao/Acomodacao";
import {Estado} from "../estado/estado";
import {Operadora} from "../operadora/operadora";
import {Administradora} from "../administradora/administradora";

export class Cotacao {

  id: number;
  estado: Estado;
  categoria: Categoria;
  acomodacao: Acomodacao;

  entidades: Entidade[];
  operadoras: Operadora[];
  profissoes: Profissao[];
  administradoras: Administradora[];

  idadeMin: number;
  idadeMax: number;
  vidas: number[] = [];
  coparticipacao: boolean;
  qtdVidas0a18anos: number = 0;
  qtdVidas19a23anos: number = 0;
  qtdVidas24a28anos: number = 0;
  qtdVidas29a33anos: number = 0;
  qtdVidas34a38anos: number = 0;
  qtdVidas39a43anos: number = 0;
  qtdVidas44a48anos: number = 0;
  qtdVidas49a53anos: number = 0;
  qtdVidas54a58anos: number = 0;
  qtdVidas59ouMaisAnos: number = 0;

}
