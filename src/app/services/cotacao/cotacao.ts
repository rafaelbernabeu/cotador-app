import {Profissao} from "../profissao/profissao";
import {Categoria} from "../categoria/categoria";
import {Entidade} from "../entidade/entidade";
import {Acomodacao} from "../acomodacao/Acomodacao";

export class Cotacao {

  id: number;
  categoria: Categoria;
  profissao: Profissao;
  entidades: Entidade[];
  acomodacao: Acomodacao;
  coparticipacao: boolean;
  qtdVidas0a18anos: number;
  qtdVidas19a23anos: number;
  qtdVidas24a28anos: number;
  qtdVidas29a33anos: number;
  qtdVidas34a38anos: number;
  qtdVidas39a43anos: number;
  qtdVidas44a48anos: number;
  qtdVidas49a53anos: number;
  qtdVidas54a58anos: number;
  qtdVidas59ouMaisAnos: number;

}
