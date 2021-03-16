import {Component, Inject, OnInit, ViewChild} from '@angular/core';
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
import {Operadora} from "../../services/operadora/operadora";
import {Administradora} from "../../services/administradora/administradora";
import {AdministradoraService} from "../../services/administradora/administradora.service";
import {OperadoraService} from "../../services/operadora/operadora.service";

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
  @ViewChild('sortReembolso') sortReembolso: MatSort;
  @ViewChild('sortLaboratorio') sortLaboratorio: MatSort;
  @ViewChild('sortCoparticipacao') sortCoparticipacao: MatSort;
  @ViewChild('paginatorHospital') paginatorHospital: MatPaginator;
  @ViewChild('paginatorReembolso') paginatorReembolso: MatPaginator;
  @ViewChild('paginatorLaboratorio') paginatorLaboratorio: MatPaginator;
  @ViewChild('paginatorCoparticipacao') paginatorCoparticipacao: MatPaginator;

  readonly displayedColumnsInicio: string[] = ['selected', 'id', 'estado', 'tabela', 'idadeMin', 'idadeMax', 'qtdMinVidas', 'qtdMinTitulares', 'acomodacao', 'administradora', 'operadora', 'produto', 'abrangencia', 'coparticipacao']
  readonly displayedColumnsFim: string[] = ['valorTotal', 'reajuste'];
  readonly displayedColumnsModoClienteInicio = ['operadora', 'produto', 'abrangencia'];
  readonly displayedColumnsModoClienteFim = ['valorTotal', 'reajuste'];

  displayedColumnsCoparticipacao: string[];
  displayedColumnsLaboratorios: string[];
  displayedColumnsHospitais: string[];
  displayedColumnsCotacao: string[];

  dataSourceCotacaoAptComCopart = new MatTableDataSource<Opcao>();
  dataSourceCotacaoAptSemCopart = new MatTableDataSource<Opcao>();
  dataSourceCotacaoEnfComCopart = new MatTableDataSource<Opcao>();
  dataSourceCotacaoEnfSemCopart = new MatTableDataSource<Opcao>();
  dataSourceLaboratorios = new MatTableDataSource<Laboratorio>();
  dataSourceCoparticipacao = new MatTableDataSource<Produto>();
  dataSourceHospitais = new MatTableDataSource<Hospital>();
  dataSourceReembolso = new MatTableDataSource<Produto>();

  todasOpcoes: Opcao[];
  todosEstados: Estado[];
  todosHospitais: Hospital[];
  todasOperadoras: Operadora[];
  todasCategorias: Categoria[];
  todasProfissoes: Profissao[];
  todasAcomodacoes: Acomodacao[];
  todasAdministradoras: Administradora[];

  modoCliente: boolean;
  todosProdutosCotacao: Produto[];
  filtroCotacao: Cotacao = new Cotacao();

  estadoAutoCompleteControl = new FormControl();
  estadoFilteredOptions: Observable<Estado[]>;

  constructor(
    @Inject('Window') public window: Window,

    private estadoService: EstadoService,
    private cotacaoService: CotacaoService,
    private hospitalService: HospitalService,
    private categoriaService: CategoriaService,
    private operadoraService: OperadoraService,
    private profissaoService: ProfissaoService,
    private acomodacaoService: AcomodacaoService,
    private administradoraService: AdministradoraService,
  ) { }

  ngOnInit(): void {
    this.hospitalService.getAllHospitais().subscribe(response => this.todosHospitais = response);
    this.operadoraService.getAllOperadoras().subscribe(response => this.todasOperadoras = response);
    this.profissaoService.getAllProfissoes().subscribe(response => this.todasProfissoes = response);
    this.categoriaService.getAllCategorias().subscribe(response => this.todasCategorias = response);
    this.acomodacaoService.getAllAcomodacoes().subscribe(response => this.todasAcomodacoes = response);
    this.administradoraService.getAllAdministradoras().subscribe(response => this.todasAdministradoras = response);
    this.estadoService.getAllEstados().subscribe(response => {
      this.todosEstados = response;
      setTimeout(() => this.estadoAutoCompleteControl.setValue(''));
    });

    this.iniciaAutoCompletes();
  }

  consultaCotacao(): void {
    this.cotacaoService.getCotacao(this.filtroCotacao).subscribe(response => {
      this.todasOpcoes = response;
      this.todasOpcoes.forEach(op => op.selected = true);
      this.todosProdutosCotacao = this.todasOpcoes.map(op => op.produto).sort((p1, p2) => p1.operadora.nome.localeCompare(p2.operadora.nome)).filter(this.filtraDuplicadas);
      this.configuraTodasTabelas();
      this.configuraDisplayedColumns();
    });
  }

  private configuraTodasTabelas() {
    this.configuraTabelasCotacao();
    this.configuraTabelasAuxiliares();
  }

  private configuraTabelasAuxiliares() {
    this.configuraTabelaHospital();
    this.configuraTabelaLaboratorio();
    this.configuraTabelaCoparticipacao();
    this.configuraTabelaReembolso();
  }

  private configuraTabelaReembolso(): void {
    this.dataSourceReembolso = new MatTableDataSource<Produto>(this.todosProdutosCotacao);
    this.dataSourceReembolso.sort = this.sortReembolso;
    this.dataSourceReembolso.paginator = this.paginatorReembolso;
  }

  private configuraTabelaCoparticipacao(): void {
    this.displayedColumnsCoparticipacao = ['tipoCoparticipacao'].concat(this.todosProdutosCotacao.map(p => p.nome));
    this.dataSourceCoparticipacao = new MatTableDataSource<Produto>(this.todosProdutosCotacao);
    this.dataSourceCoparticipacao.sort = this.sortCoparticipacao;
    this.dataSourceCoparticipacao.paginator = this.paginatorCoparticipacao;
  }

  private configuraTabelaHospital(): void {
    this.displayedColumnsHospitais = ['nomeHospital'].concat(this.todosProdutosCotacao.map(p => p.nome));
    this.dataSourceHospitais = new MatTableDataSource<Hospital>(this.todosProdutosCotacao.map(p => p.hospitais).reduce((acc, value) => acc.concat(value)).filter(this.filtraDuplicadas));
    this.dataSourceHospitais.sort = this.sortHospital;
    this.dataSourceHospitais.paginator = this.paginatorHospital;
  }

  private configuraTabelaLaboratorio(): void {
    this.displayedColumnsLaboratorios = ['nomeLaboratorio'].concat(this.todosProdutosCotacao.map(p => p.nome));
    this.dataSourceLaboratorios = new MatTableDataSource<Laboratorio>(this.todosProdutosCotacao.map(p => p.laboratorios).reduce((acc, value) => acc.concat(value)).filter(this.filtraDuplicadas));
    this.dataSourceLaboratorios.sort = this.sortLaboratorio;
    this.dataSourceLaboratorios.paginator = this.paginatorLaboratorio;
  }

  private configuraTabelasCotacao(): void {
    this.configuraTabelaEnfComCopart(this.todasOpcoes);
    this.configuraTabelaEnfSemCopart(this.todasOpcoes);
    this.configuraTabelaAptComCopart(this.todasOpcoes);
    this.configuraTabelaAptSemCopart(this.todasOpcoes);
  }

  private configuraTabelaAptSemCopart(opcoes: Opcao[]) {
    this.dataSourceCotacaoAptSemCopart = new MatTableDataSource<Opcao>(opcoes.filter(op => op.acomodacao === 'Apartamento' && !op.coparticipacao));
    this.dataSourceCotacaoAptSemCopart.sort = this.sortCotacaoAptSemCopart;
    this.dataSourceCotacaoAptSemCopart.paginator = this.paginatorCotacaoAptSemCopart;
    this.dataSourceCotacaoAptSemCopart.sortingDataAccessor = this.getSortingDataAccessor();
  }

  private configuraTabelaAptComCopart(opcoes: Opcao[]) {
    this.dataSourceCotacaoAptComCopart = new MatTableDataSource<Opcao>(opcoes.filter(op => op.acomodacao === 'Apartamento' && op.coparticipacao));
    this.dataSourceCotacaoAptComCopart.sort = this.sortCotacaoAptComCopart;
    this.dataSourceCotacaoAptComCopart.paginator = this.paginatorCotacaoAptComCopart;
    this.dataSourceCotacaoAptComCopart.sortingDataAccessor = this.getSortingDataAccessor();
  }

  private configuraTabelaEnfSemCopart(opcoes: Opcao[]) {
    this.dataSourceCotacaoEnfSemCopart = new MatTableDataSource<Opcao>(opcoes.filter(op => op.acomodacao === 'Enfermaria' && !op.coparticipacao));
    this.dataSourceCotacaoEnfSemCopart.sort = this.sortCotacaoEnfSemCopart;
    this.dataSourceCotacaoEnfSemCopart.paginator = this.paginatorCotacaoEnfSemCopart;
    this.dataSourceCotacaoEnfSemCopart.sortingDataAccessor = this.getSortingDataAccessor();
  }

  private configuraTabelaEnfComCopart(opcoes: Opcao[]) {
    this.dataSourceCotacaoEnfComCopart = new MatTableDataSource<Opcao>(opcoes.filter(op => op.acomodacao === 'Enfermaria' && op.coparticipacao));
    this.dataSourceCotacaoEnfComCopart.sort = this.sortCotacaoEnfComCopart;
    this.dataSourceCotacaoEnfComCopart.paginator = this.paginatorCotacaoEnfComCopart;
    this.dataSourceCotacaoEnfComCopart.sortingDataAccessor = this.getSortingDataAccessor();
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

  modelChangeCategoria(categoria: Categoria): void {
    if (categoria === 'Empresarial') {
      this.filtroCotacao.profissoes = [];
    }
    this.filtroCotacao.categoria = categoria;
  }

  displayEntidades(cotacao: Opcao): string {
    return cotacao.tabela.entidades.map(e => e.nome).join(',')
  }

  verificaSeHospitalSelecionado(produto: Produto, hospital: Hospital): boolean {
    return produto.hospitais.filter(h => h.id === hospital.id).length > 0;
  }

  verificaSeLaboratorioSelecionado(produto: Produto, laboratorio: Laboratorio): boolean {
    return produto.laboratorios.filter(l => l.id === laboratorio.id).length > 0;
  }

  private filtraDuplicadas(value: { id }, index, self: { id }[]): boolean {
    const searchElement: {id} = self.filter(item => item.id === value.id)[0];
    return self.indexOf(searchElement) === index;
  }

  updateDisplayedColumns() {
    setTimeout(() => this.configuraDisplayedColumns());
  }

  configuraDisplayedColumns(): void {
    let columns: string[];

    if (this.modoCliente) {
      columns = [...this.displayedColumnsModoClienteInicio];
    } else {
      columns = [...this.displayedColumnsInicio];
    }

    this.adicionaColunasPorQtdVidas(columns);

    if (this.modoCliente) {
      this.displayedColumnsCotacao = columns.concat(this.displayedColumnsModoClienteFim);
    } else {
      this.displayedColumnsCotacao = columns.concat(this.displayedColumnsFim);
      if (this.filtroCotacao.profissoes) {
        this.displayedColumnsCotacao.push(...this.filtroCotacao.profissoes.map(p => p.nome));
      }
    }
  }

  private adicionaColunasPorQtdVidas(columns: string[]): string[] {
    if (this.filtroCotacao.qtdVidas0a18anos > 0) {
      columns.push('valor0a18anos')
    }
    if (this.filtroCotacao.qtdVidas19a23anos > 0) {
      columns.push('valor19a23anos')
    }
    if (this.filtroCotacao.qtdVidas24a28anos > 0) {
      columns.push('valor24a28anos')
    }
    if (this.filtroCotacao.qtdVidas29a33anos > 0) {
      columns.push('valor29a33anos')
    }
    if (this.filtroCotacao.qtdVidas34a38anos > 0) {
      columns.push('valor34a38anos')
    }
    if (this.filtroCotacao.qtdVidas39a43anos > 0) {
      columns.push('valor39a43anos')
    }
    if (this.filtroCotacao.qtdVidas44a48anos > 0) {
      columns.push('valor44a48anos')
    }
    if (this.filtroCotacao.qtdVidas49a53anos > 0) {
      columns.push('valor49a53anos')
    }
    if (this.filtroCotacao.qtdVidas54a58anos > 0) {
      columns.push('valor54a58anos')
    }
    if (this.filtroCotacao.qtdVidas59ouMaisAnos > 0) {
      columns.push('valor59ouMaisAnos')
    }

    return columns;
  }

  getNomesEntidadesPorProfissao(opcao: Opcao, profissao: string): string {
    return opcao.tabela.entidades.filter(e => e.profissoes.filter(p => p.nome === profissao).length > 0).map(e => e.nome).join(' / ');
  }

  getTableWidth(): string {
    return (this.displayedColumnsCotacao?.length * 120)  +'px';
  }

  alteraModo(modoCliente: boolean) {
    this.modoCliente = modoCliente;
    this.configuraDisplayedColumns();
    if (this.modoCliente) {
      this.todosProdutosCotacao = this.todasOpcoes.filter(op => op.selected).map(op => op.produto).sort((p1, p2) => p1.operadora.nome.localeCompare(p2.operadora.nome)).filter(this.filtraDuplicadas);
      this.configuraTabelaEnfComCopart(this.dataSourceCotacaoEnfComCopart.data.filter(op => op.selected));
      this.configuraTabelaEnfSemCopart(this.dataSourceCotacaoEnfSemCopart.data.filter(op => op.selected));
      this.configuraTabelaAptComCopart(this.dataSourceCotacaoAptComCopart.data.filter(op => op.selected));
      this.configuraTabelaAptSemCopart(this.dataSourceCotacaoAptSemCopart.data.filter(op => op.selected));
      this.configuraTabelasAuxiliares();
    } else {
      this.todosProdutosCotacao = this.todasOpcoes.map(op => op.produto).sort((p1, p2) => p1.operadora.nome.localeCompare(p2.operadora.nome)).filter(this.filtraDuplicadas);
      this.configuraTodasTabelas();
    }
  }
}
