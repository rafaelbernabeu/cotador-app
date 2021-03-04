import {Tabela} from '../tabela/tabela';
import {Acomodacao} from '../acomodacao/Acomodacao';
import {Categoria} from '../categoria/categoria';
import {Produto} from '../produto/produto';

export class Opcao {

  id: number;
  mei = false;
  tabela: Tabela;
  produto: Produto;
  acomodacao: Acomodacao;
  categoria: Categoria;
  coparticipacao;
  valor0a18anos: number;
  valor19a23anos: number;
  valor24a28anos: number;
  valor29a33anos: number;
  valor34a38anos: number;
  valor39a43anos: number;
  valor44a48anos: number;
  valor49a53anos: number;
  valor54a58anos: number;
  valor59ouMaisAnos: number;

}
