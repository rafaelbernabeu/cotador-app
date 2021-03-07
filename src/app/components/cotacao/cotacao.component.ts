import {Component, OnInit, ViewChild} from '@angular/core';
import {CotacaoService} from "../../services/cotacao/cotacao.service";
import {Cotacao} from "../../services/cotacao/cotacao";
import {CategoriaService} from "../../services/categoria/categoria.service";
import {Categoria} from "../../services/categoria/categoria";
import {FormControl} from "@angular/forms";
import {Estado} from "../../services/estado/estado";
import {Profissao} from "../../services/profissao/profissao";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {ProfissaoService} from "../../services/profissao/profissao.service";
import {Acomodacao} from "../../services/acomodacao/Acomodacao";
import {AcomodacaoService} from "../../services/acomodacao/acomodacao.service";
import {EstadoService} from "../../services/estado/estado.service";
import {Opcao} from "../../services/opcao/opcao";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-cotacao',
  templateUrl: './cotacao.component.html',
  styleUrls: ['./cotacao.component.scss']
})
export class CotacaoComponent implements OnInit {

  @ViewChild(MatSort) sortCotacao: MatSort;
  @ViewChild(MatPaginator) paginatorCotacao: MatPaginator;

  displayedColumns: string[] = ['id', 'estado', 'nomeTabela', 'nomeProduto', 'acomodacao', 'coparticipacao', 'valor', 'entidades'];
  dataSourceCotacao = new MatTableDataSource<Opcao>();

  filtroCotacao: Cotacao = new Cotacao();
  todosEstados: Estado[];
  todasOpcoes: Opcao[];
  todasCategorias: Categoria[];
  todasProfissoes: Profissao[];
  todasAcomodacoes: Acomodacao[];

  estadoAutoCompleteControl = new FormControl();
  profissaoAutoCompleteControl = new FormControl();

  estadoFilteredOptions: Observable<Estado[]>;
  profissaoFilteredOptions: Observable<Profissao[]>;

  constructor(
    private estadoService: EstadoService,
    private cotacaoService: CotacaoService,
    private categoriaService: CategoriaService,
    private profissaoService: ProfissaoService,
    private acomodacaoService: AcomodacaoService,
  ) { }

  ngOnInit(): void {
    this.iniciaAutoCompletes();
    this.cotacaoService.getCotacao(this.filtroCotacao).subscribe(response => console.log(response));
    this.estadoService.getAllEstados().subscribe(response => this.todosEstados = response);
    this.categoriaService.getAllCategorias().subscribe(response => this.todasCategorias = response);
    this.profissaoService.getAllProfissoes().subscribe(response => this.todasProfissoes = response);
    this.acomodacaoService.getAllAcomodacoes().subscribe(response => this.todasAcomodacoes = response);
  }

  consultaCotacao(): void {
    this.cotacaoService.getCotacao(this.filtroCotacao).subscribe(response => {
      this.todasOpcoes = response
      this.dataSourceCotacao = new MatTableDataSource<Opcao>(response);
      this.dataSourceCotacao.sort = this.sortCotacao;
      this.dataSourceCotacao.paginator = this.paginatorCotacao;
      this.dataSourceCotacao.sortingDataAccessor = (opcao, property) => {
        switch (property) {
          default:
            return opcao[property];
        }
      };
    });
  }

  private iniciaAutoCompletes(): void {
    this.estadoFilteredOptions = this.estadoAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.estadoFilterAutoComplete(value))
    );
    this.profissaoFilteredOptions = this.profissaoAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.profissaoFilterAutoComplete(value))
    );
  }

  private estadoFilterAutoComplete(value: string): Estado[] {
    const filterValue = value?.toLowerCase();
    return this.todosEstados?.filter(estado => estado.nome.toLowerCase().includes(filterValue) || estado.sigla.toLowerCase().includes(filterValue));
  }

  private profissaoFilterAutoComplete(value: string): Profissao[] {
    const filterValue = value?.toLowerCase();
    return this.todasProfissoes?.filter(profissao => profissao.nome.toLowerCase().includes(filterValue));
  }

  estadoDisplayFn(estado: Estado): string {
    return estado && estado.nome ? estado.nome : '';
  }

  profissaoDisplayFn(profissao: Profissao): string {
    return profissao && profissao.nome ? profissao.nome : '';
  }

  selecionaCotacao(cotacao: Opcao) {
    console.log(cotacao);
  }

  calculaValorCotacao(opcao: Opcao): number {
    const valor0a18anos = this.filtroCotacao.qtdVidas0a18anos * opcao.valor0a18anos;
    const valor19a23anos = this.filtroCotacao.qtdVidas19a23anos * opcao.valor19a23anos;
    const valor24a28anos = this.filtroCotacao.qtdVidas24a28anos * opcao.valor24a28anos;
    const valor29a33anos = this.filtroCotacao.qtdVidas29a33anos * opcao.valor29a33anos;
    const valor34a38anos = this.filtroCotacao.qtdVidas34a38anos * opcao.valor34a38anos;
    const valor39a43anos = this.filtroCotacao.qtdVidas39a43anos * opcao.valor39a43anos;
    const valor44a48anos = this.filtroCotacao.qtdVidas44a48anos * opcao.valor44a48anos;
    const valor49a53anos = this.filtroCotacao.qtdVidas49a53anos * opcao.valor49a53anos;
    const valor54a58anos = this.filtroCotacao.qtdVidas54a58anos * opcao.valor54a58anos;
    const valor59ouMaisAnos = this.filtroCotacao.qtdVidas59ouMaisAnos * opcao.valor59ouMaisAnos;

    return valor0a18anos + valor19a23anos + valor24a28anos + valor29a33anos + valor34a38anos + valor39a43anos + valor44a48anos + valor49a53anos + valor54a58anos + valor59ouMaisAnos;
  }

  consultaCotacaoCategoria(categoria: Categoria): void {
    if (categoria === 'Empresarial') {
      this.profissaoAutoCompleteControl.setValue('');
    }
    this.filtroCotacao.categoria = categoria;
    this.consultaCotacao();
  }

  consultaCotacaoCoparticipacao(coparticipacao: boolean): void {
    this.filtroCotacao.coparticipacao = coparticipacao;
    this.consultaCotacao();
  }

  consultaCotacaoEstado(estado: Estado): void {
    if (estado?.sigla && estado?.nome) {
      this.filtroCotacao.estado = estado;
      this.consultaCotacao();
    } else {
      this.filtroCotacao.estado = null;
    }
  }

  consultaCotacaoProfissao(profissao: Profissao): void {
    if (profissao?.id) {
      this.filtroCotacao.profissao = profissao;
      this.consultaCotacao();
    } else {
      this.filtroCotacao.profissao = null;
    }
  }

  consultaCotacaoAcomodacao(acomodacao: Acomodacao): void {
    this.filtroCotacao.acomodacao = acomodacao;
    this.consultaCotacao();
  }

  displayEntidades(cotacao: Opcao): string {
    return cotacao.tabela.entidades.map(e => e.nome).join(',')
  }
}
