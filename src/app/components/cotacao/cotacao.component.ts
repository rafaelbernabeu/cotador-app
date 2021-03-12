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
import {MatAccordion} from "@angular/material/expansion";
import {Hospital} from "../../services/hospital/hospital";
import {Laboratorio} from "../../services/laboratorio/laboratorio";
import {Produto} from "../../services/produto/produto";
import {HospitalService} from "../../services/hospital/hospital.service";

@Component({
  selector: 'app-cotacao',
  templateUrl: './cotacao.component.html',
  styleUrls: ['./cotacao.component.scss']
})
export class CotacaoComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('sortCotacaoAptComCopart') sortCotacaoAptComCopart: MatSort;
  @ViewChild('sortCotacaoAptSemCopart') sortCotacaoAptSemCopart: MatSort;
  @ViewChild('sortCotacaoEnfComCopart') sortCotacaoEnfComCopart: MatSort;
  @ViewChild('sortCotacaoEnfSemCopart') sortCotacaoEnfSemCopart: MatSort;
  @ViewChild('paginatorCotacaoAptComCopart') paginatorCotacaoAptComCopart: MatPaginator;
  @ViewChild('paginatorCotacaoAptSemCopart') paginatorCotacaoAptSemCopart: MatPaginator;
  @ViewChild('paginatorCotacaoEnfComCopart') paginatorCotacaoEnfComCopart: MatPaginator;
  @ViewChild('paginatorCotacaoEnfSemCopart') paginatorCotacaoEnfSemCopart: MatPaginator;

  @ViewChild('sortHospital') sortHospital: MatSort;
  @ViewChild('sortLaboratorio') sortLaboratorio: MatSort;
  @ViewChild('paginatorHospital') paginatorHospital: MatPaginator;
  @ViewChild('paginatorLaboratorio') paginatorLaboratorio: MatPaginator;

  displayedColumnsHospitais: string[];
  displayedColumns: string[] = ['id', 'estado', 'nomeTabela', 'nomeProduto', 'acomodacao', 'coparticipacao', 'valor', 'entidades'];

  dataSourceCotacaoAptComCopart = new MatTableDataSource<Opcao>();
  dataSourceCotacaoAptSemCopart = new MatTableDataSource<Opcao>();
  dataSourceCotacaoEnfComCopart = new MatTableDataSource<Opcao>();
  dataSourceCotacaoEnfSemCopart = new MatTableDataSource<Opcao>();
  dataSourceHospitais = new MatTableDataSource<Hospital>();
  dataSourceLaboratorios = new MatTableDataSource<Laboratorio>();

  todasOpcoes: Opcao[];
  todosEstados: Estado[];
  todosHospitais: Hospital[];
  todasCategorias: Categoria[];
  todasProfissoes: Profissao[];
  todasAcomodacoes: Acomodacao[];

  todosProdutosCotacao: Produto[];
  filtroCotacao: Cotacao = new Cotacao();

  estadoAutoCompleteControl = new FormControl();
  estadoFilteredOptions: Observable<Estado[]>;

  constructor(
    private estadoService: EstadoService,
    private cotacaoService: CotacaoService,
    private hospitalService: HospitalService,
    private categoriaService: CategoriaService,
    private profissaoService: ProfissaoService,
    private acomodacaoService: AcomodacaoService,
  ) { }

  ngOnInit(): void {
    this.hospitalService.getAllHospitais().subscribe(response => this.todosHospitais = response);
    this.profissaoService.getAllProfissoes().subscribe(response => this.todasProfissoes = response);
    this.categoriaService.getAllCategorias().subscribe(response => this.todasCategorias = response);
    this.acomodacaoService.getAllAcomodacoes().subscribe(response => this.todasAcomodacoes = response);
    this.estadoService.getAllEstados().subscribe(response => {
      this.todosEstados = response;
      setTimeout(() => this.estadoAutoCompleteControl.setValue(''));
    });

    this.iniciaAutoCompletes();
  }

  consultaCotacao(): void {
    this.cotacaoService.getCotacao(this.filtroCotacao).subscribe(response => {
      this.todasOpcoes = response;
      this.configuraTabelasCotacao(this.todasOpcoes);
      this.configuraTabelaHospital(this.todasOpcoes);
    });
  }

  private configuraTabelaHospital(opcao: Opcao[]) {
    this.todosProdutosCotacao = opcao.map(op => op.produto).filter(this.filtraDuplicadas);
    this.displayedColumnsHospitais = ['nomeHospital'].concat(this.todosProdutosCotacao.map(p => p.nome));
    this.dataSourceHospitais = new MatTableDataSource<Hospital>(this.todosProdutosCotacao.map(p => p.hospitais).reduce((acc, value) => acc.concat(value)).filter(this.filtraDuplicadas));
    this.dataSourceHospitais.sort = this.sortHospital;
    this.dataSourceHospitais.paginator = this.paginatorHospital;
  }

  private configuraTabelasCotacao(opcoes: Opcao[]): void {
    this.dataSourceCotacaoEnfComCopart = new MatTableDataSource<Opcao>(opcoes.filter(op => op.acomodacao === 'Enfermaria' && op.coparticipacao));
    this.dataSourceCotacaoEnfSemCopart = new MatTableDataSource<Opcao>(opcoes.filter(op => op.acomodacao === 'Enfermaria' && !op.coparticipacao));
    this.dataSourceCotacaoAptComCopart = new MatTableDataSource<Opcao>(opcoes.filter(op => op.acomodacao === 'Apartamento' && op.coparticipacao));
    this.dataSourceCotacaoAptSemCopart = new MatTableDataSource<Opcao>(opcoes.filter(op => op.acomodacao === 'Apartamento' && !op.coparticipacao));
    this.dataSourceCotacaoEnfComCopart.sort = this.sortCotacaoEnfComCopart;
    this.dataSourceCotacaoEnfSemCopart.sort = this.sortCotacaoEnfSemCopart;
    this.dataSourceCotacaoAptComCopart.sort = this.sortCotacaoAptComCopart;
    this.dataSourceCotacaoAptSemCopart.sort = this.sortCotacaoAptSemCopart;
    this.dataSourceCotacaoEnfComCopart.paginator = this.paginatorCotacaoEnfComCopart;
    this.dataSourceCotacaoEnfSemCopart.paginator = this.paginatorCotacaoEnfSemCopart;
    this.dataSourceCotacaoAptComCopart.paginator = this.paginatorCotacaoAptComCopart;
    this.dataSourceCotacaoAptSemCopart.paginator = this.paginatorCotacaoAptSemCopart;
    this.dataSourceCotacaoEnfComCopart.sortingDataAccessor = this.getSortingDataAccessor();
    this.dataSourceCotacaoEnfSemCopart.sortingDataAccessor = this.getSortingDataAccessor();
    this.dataSourceCotacaoAptComCopart.sortingDataAccessor = this.getSortingDataAccessor();
    this.dataSourceCotacaoAptSemCopart.sortingDataAccessor = this.getSortingDataAccessor();
  }

  private getSortingDataAccessor() {
    return (opcao, property) => {
      switch (property) {
        default:
          return opcao[property];
      }
    };
  }

  private iniciaAutoCompletes(): void {
    this.estadoFilteredOptions = this.estadoAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.estadoFilterAutoComplete(value))
    );
  }

  private estadoFilterAutoComplete(value: string): Estado[] {
    const filterValue = value?.toLowerCase();
    return this.todosEstados?.filter(estado => estado.nome.toLowerCase().includes(filterValue) || estado.sigla.toLowerCase().includes(filterValue));
  }

  estadoDisplayFn(estado: Estado): string {
    return estado && estado.nome ? estado.nome : '';
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
      this.filtroCotacao.profissoes = [];
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
    setTimeout(() => this.consultaCotacao());
  }

  consultaCotacaoAcomodacao(acomodacao: Acomodacao): void {
    this.filtroCotacao.acomodacao = acomodacao;
    this.consultaCotacao();
  }

  displayEntidades(cotacao: Opcao): string {
    return cotacao.tabela.entidades.map(e => e.nome).join(',')
  }

  verificaSeHospitalSelecionado(produto: Produto, hospital: Hospital): boolean {
    return produto.hospitais.filter(h => h.id === hospital.id).length > 0;
  }

  private filtraDuplicadas(value: { id }, index, self: { id }[]): boolean {
    const searchElement: {id} = self.filter(item => item.id === value.id)[0];
    return self.indexOf(searchElement) === index;
  }
}
