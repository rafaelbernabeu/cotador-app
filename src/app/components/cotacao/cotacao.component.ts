import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {CotacaoService} from "../../services/cotacao/cotacao.service";
import {Cotacao} from "../../services/cotacao/cotacao";
import {CategoriaService} from "../../services/categoria/categoria.service";
import {Categoria} from "../../services/categoria/categoria";
import {FormControl, NgForm} from "@angular/forms";
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
import {MatAccordion, MatExpansionPanel} from "@angular/material/expansion";
import {Hospital} from "../../services/hospital/hospital";
import {Laboratorio} from "../../services/laboratorio/laboratorio";
import {Produto} from "../../services/produto/produto";
import {HospitalService} from "../../services/hospital/hospital.service";
import {Operadora} from "../../services/operadora/operadora";
import {Administradora} from "../../services/administradora/administradora";
import {AdministradoraService} from "../../services/administradora/administradora.service";
import {OperadoraService} from "../../services/operadora/operadora.service";
import {BACKSLASH, COMMA, DASH, ENTER, SEMICOLON, SLASH} from "@angular/cdk/keycodes";
import {MatChipInputEvent, MatChipList} from "@angular/material/chips";
import {UtilService} from "../../services/util/util.service";
import {SnackbarService} from "../../services/snackbar/snackbar.service";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {ActivatedRoute, Router} from "@angular/router";
import {Clipboard} from "@angular/cdk/clipboard";

@Component({
  selector: 'app-cotacao',
  templateUrl: './cotacao.component.html',
  styleUrls: ['./cotacao.component.scss']
})
export class CotacaoComponent implements OnInit {

  @ViewChild(NgForm) formCotacao: NgForm;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('panelAptComCopart') panelAptComCopart: MatExpansionPanel;
  @ViewChild('panelAptSemCopart') panelAptSemCopart: MatExpansionPanel;
  @ViewChild('panelEnfComCopart') panelEnfComCopart: MatExpansionPanel;
  @ViewChild('panelEnfSemCopart') panelEnfSemCopart: MatExpansionPanel;
  @ViewChild('panelCoparticipacao') panelCoparticipacao: MatExpansionPanel;
  @ViewChild('panelLaboratorios') panelLaboratorios: MatExpansionPanel;
  @ViewChild('panelHospitais') panelHospitais: MatExpansionPanel;
  @ViewChild('panelReembolso') panelReembolso: MatExpansionPanel;

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
  @ViewChild("chipListTitulares") chipListTitulares: MatChipList;
  @ViewChild("chipListProfissoes") chipListProfissoes: MatChipList;
  @ViewChild('paginatorHospital') paginatorHospital: MatPaginator;
  @ViewChild('paginatorReembolso') paginatorReembolso: MatPaginator;
  @ViewChild('paginatorLaboratorio') paginatorLaboratorio: MatPaginator;

  @ViewChild('profisaoAutoCompleteInput') profissoesInput: ElementRef<HTMLInputElement>;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.code === 'Enter') {
        event.preventDefault();
        this.consultaCotacao();
      } else if (event.code === 'KeyE' && this.isBloquearInputs()) {
        event.preventDefault();
        this.desbloquearInputs();
      }
    }
  }

  readonly displayedColumnsInicio: string[] = ['selected', 'id', 'estado', 'administradora', 'operadora', 'tabela', 'qtdMinVidas', 'idadeMin', 'idadeMax', 'qtdMinTitulares', 'produto', 'abrangencia', 'valorTotal']
  readonly displayedColumnsFim: string[] = ['reajuste'];
  readonly displayedColumnsModoClienteInicio = ['operadora', 'produto', 'abrangencia', 'valorTotal'];
  readonly displayedColumnsModoClienteFim = ['reajuste'];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON, DASH, SLASH, BACKSLASH];

  displayedColumnsCoparticipacao: string[];
  displayedColumnsLaboratorios: string[];
  displayedColumnsHospitais: string[];
  displayedColumnsCotacao: string[];

  dataSourceCotacaoAptComCopart = new MatTableDataSource<Opcao>();
  dataSourceCotacaoAptSemCopart = new MatTableDataSource<Opcao>();
  dataSourceCotacaoEnfComCopart = new MatTableDataSource<Opcao>();
  dataSourceCotacaoEnfSemCopart = new MatTableDataSource<Opcao>();
  dataSourceLaboratorios = new MatTableDataSource<Laboratorio>();
  dataSourceCoparticipacao = new MatTableDataSource<string>();
  dataSourceHospitais = new MatTableDataSource<Hospital>();
  dataSourceReembolso = new MatTableDataSource<Produto>();

  cotacao: Cotacao;
  todasOpcoes: Opcao[];
  todosEstados: Estado[];
  todosHospitais: Hospital[];
  todasOperadoras: Operadora[];
  todasCategorias: Categoria[];
  todasProfissoes: Profissao[];
  todasAcomodacoes: Acomodacao[];
  todasAdministradoras: Administradora[];

  modoCliente: boolean;
  melhorPrecoProduto: boolean = true;
  todosProdutosCotacao: Produto[];
  filtroCotacao: Cotacao = new Cotacao();

  estadoAutoCompleteControl = new FormControl();
  profissaoAutoCompleteControl = new FormControl();
  estadoFilteredOptions: Observable<Estado[]>;
  profissoesFilteredOptions: Observable<Profissao[]>;

  constructor(
    @Inject('Window') public window: Window,

    private router: Router,
    private clipboard: Clipboard,
    private snackBar: SnackbarService,
    private estadoService: EstadoService,
    private activatedRoute: ActivatedRoute,
    private cotacaoService: CotacaoService,
    private hospitalService: HospitalService,
    private categoriaService: CategoriaService,
    private operadoraService: OperadoraService,
    private profissaoService: ProfissaoService,
    private acomodacaoService: AcomodacaoService,
    private administradoraService: AdministradoraService,
  ) { }

  ngOnInit(): void {
    this.estadoService.getAllEstados().subscribe(response => this.todosEstados = response);
    this.hospitalService.getAllHospitais().subscribe(response => this.todosHospitais = response);
    this.operadoraService.getAllOperadoras().subscribe(response => this.todasOperadoras = response);
    this.profissaoService.getAllProfissoes().subscribe(response => this.todasProfissoes = response);
    this.categoriaService.getAllCategorias().subscribe(response => this.todasCategorias = response);
    this.acomodacaoService.getAllAcomodacoes().subscribe(response => this.todasAcomodacoes = response);
    this.administradoraService.getAllAdministradoras().subscribe(response => this.todasAdministradoras = response);

    this.esperaCarregamentoDosCampos();
  }

  esperaCarregamentoDosCampos(): void {
    if (this.isCarregamentoCompleto()) {
      this.inicializaCotacao();
    } else {
      setTimeout(() => this.esperaCarregamentoDosCampos(), 200);
    }
  }

  inicializaCotacao(): void {
    this.iniciaAutoCompletes();
    this.activatedRoute.paramMap.subscribe(params => {
      const id = Number.parseInt(params.get('id'));
      if (id > 0) {
        this.cotacaoService.recuperaCotacao(id).subscribe(response => {
          if (response.id) {
            this.cotacao = response;
            this.filtroCotacao.mei = response.mei;
            this.filtroCotacao.categoria = response.categoria;
            this.filtroCotacao.tipoAdesao = response.tipoAdesao;
            this.filtroCotacao.coparticipacao = response.coparticipacao === null ? null : response.coparticipacao === 'Ambas' ? response.coparticipacao : response.coparticipacao == 'true';
            this.filtroCotacao.acomodacao = response.acomodacao;
            this.filtroCotacao.titulares = response.titulares;
            this.filtroCotacao.dependentes = response.dependentes;
            this.filtroCotacao.operadoras = this.todasOperadoras.filter(p => response.operadoras?.filter(ro => p.id === ro.id)?.length);
            this.filtroCotacao.profissoes = this.todasProfissoes.filter(p => response.profissoes?.filter(rp => p.id === rp.id)?.length);
            this.filtroCotacao.administradoras = this.todasAdministradoras.filter(p => response.administradoras?.filter(ra => p.id === ra.id)?.length);

            this.estadoAutoCompleteControl.setValue(response.estado ? response.estado : '');
            this.configuraQtdVidas();
            setTimeout(() => this.consultaCotacao());
          } else {
            this.snackBar.openSnackBar("Cotação não encontrada!")
            this.limpar();
          }
        })
      } else {
        this.limpar();
      }
    });
  }

  isCarregamentoCompleto(): boolean {
    return this.todosEstados && this.todosHospitais && this.todasOperadoras && this.todasProfissoes &&
      this.todasCategorias && this.todasAcomodacoes && (this.todasAdministradoras != null);
  }

  limpar(): void {
    setTimeout(() => {
      this.todasOpcoes = [];
      this.cotacao = new Cotacao();
      this.todosProdutosCotacao = [];
      this.filtroCotacao = new Cotacao();
      this.profissaoAutoCompleteControl.setValue('');
      this.profissaoAutoCompleteControl.enable();
      this.estadoAutoCompleteControl.setValue('');
      this.estadoAutoCompleteControl.enable();
      this.configuraTodasTabelas();
    })
  }

  copiarLink(): void {
    this.cotacaoService.atualizaOpcoesOcultas(this.cotacao.id, this.todasOpcoes.filter(op => !op.selected).map(op => op.id)).subscribe(response => {
      window.history.pushState(null, window.document.title, '#/cotacao/' + response);
      this.clipboard.copy(window.location.href);
      this.snackBar.openSnackBar("Link copiado!");
    });
  }

  consultaCotacao(): void {
    if (this.isFormValido()) {
      this.chipListTitulares.errorState = false;
      if (this.chipListProfissoes) {
        this.chipListProfissoes.errorState = false;
      }
      this.filtroCotacao.estado = this.estadoAutoCompleteControl.value ? this.estadoAutoCompleteControl.value : null ;
      this.cotacaoService.geraCotacao(this.filtroCotacao).subscribe(response => {
        this.todasOpcoes = response.opcoes;
        this.todasOpcoes.forEach(op => op.selected = true);
        this.todosProdutosCotacao = this.todasOpcoes.map(op => op.produto).sort((p1, p2) => p1.operadora.nome.localeCompare(p2.operadora.nome)).filter(UtilService.filtraDuplicadasId);
        if (this.cotacao?.opcoesOcultas?.length) {
          this.todasOpcoes.filter(op => this.cotacao.opcoesOcultas.filter(opOc => opOc === op.id).length).forEach(op => op.selected = false);
        }
        this.cotacao = response;
        this.configuraTodasTabelas();
        this.configuraDisplayedColumns();
        this.accordion.openAll();
        this.estadoAutoCompleteControl.disable();
      });
    } else {
      this.erroFormInvalido();
    }
  }

  private isFormValido(): boolean {
    if (this.isCotacaoAdesao()) {
      return this.formCotacao.valid &&
        this.filtroCotacao.titulares.length > 0 &&
        this.filtroCotacao.profissoes.length > 0
    } else if (this.isCotacaoEmpresarial()) {
      return this.formCotacao.valid &&
        this.filtroCotacao.titulares.length > 0
    }
    return false;
  }

  private erroFormInvalido(): void {
    this.formCotacao.form.markAllAsTouched();
    this.chipListTitulares.errorState = !this.filtroCotacao.titulares.length;
    if (this.chipListProfissoes) {
      this.chipListProfissoes.errorState = !this.filtroCotacao.profissoes.length;
    }
    this.snackBar.openSnackBar("Preencha todos os campos!");
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
    this.dataSourceReembolso.sortingDataAccessor = (produto, property) => {
      switch (property) {
        case 'produto':
          return produto.nome;
        case 'reembolso':
          return produto.reembolso;
        case 'operadora':
          return produto.operadora.nome;
      }
    }
    if (!this.dataSourceReembolso.data.length) {
      setTimeout(() => this.panelReembolso.close());
    }
  }

  private configuraTabelaCoparticipacao(): void {
    this.displayedColumnsCoparticipacao = ['tipoCoparticipacao'].concat(this.todosProdutosCotacao.map(p => p.id.toString()));
    this.dataSourceCoparticipacao = new MatTableDataSource<string>(['Pronto Socorro', 'Consultas', 'Exame Simples', 'Exame Especial', 'Internacao']);
    if (!this.dataSourceCoparticipacao.data.length) {
      setTimeout(() => this.panelCoparticipacao.close());
    }
  }

  private configuraTabelaHospital(): void {
    let hospitais = this.todosProdutosCotacao.map(p => p.hospitais);
    this.displayedColumnsHospitais = ['nomeHospital'].concat(this.todosProdutosCotacao.map(p => p.id.toString()));
    this.dataSourceHospitais = new MatTableDataSource<Hospital>(hospitais.length ? hospitais.reduce((acc, value) => acc.concat(value)).filter(UtilService.filtraDuplicadasId) : []);
    this.dataSourceHospitais.sort = this.sortHospital;
    this.dataSourceHospitais.paginator = this.paginatorHospital;
    this.dataSourceHospitais.sortingDataAccessor = (hospital, property) => hospital.nome;
    if (!this.dataSourceHospitais.data.length) {
      setTimeout(() => this.panelHospitais.close());
    }
  }

  private configuraTabelaLaboratorio(): void {
    this.displayedColumnsLaboratorios = ['nomeLaboratorio'].concat(this.todosProdutosCotacao.map(p => p.id.toString()));
    let laboratorios = this.todosProdutosCotacao.map(p => p.laboratorios);
    this.dataSourceLaboratorios = new MatTableDataSource<Laboratorio>(laboratorios.length ? laboratorios.reduce((acc, value) => acc.concat(value)).filter(UtilService.filtraDuplicadasId) : []);
    this.dataSourceLaboratorios.sort = this.sortLaboratorio;
    this.dataSourceLaboratorios.paginator = this.paginatorLaboratorio;
    this.dataSourceLaboratorios.sortingDataAccessor = (laboratorio, property) => laboratorio.nome;
    if (!this.dataSourceLaboratorios.data.length) {
      setTimeout(() => this.panelLaboratorios.close());
    }
  }

  modelChangeMelhorPreco(): void {
    setTimeout(() => this.configuraTabelasCotacao());
  }

  private configuraTabelasCotacao(): void {
    this.configuraTabelaEnfComCopart(this.todasOpcoes);
    this.configuraTabelaEnfSemCopart(this.todasOpcoes);
    this.configuraTabelaAptComCopart(this.todasOpcoes);
    this.configuraTabelaAptSemCopart(this.todasOpcoes);
  }

  private filtraProdutoMenorPreco(opcao: Opcao, index: number, todasOpcoes: Opcao[], context: CotacaoComponent): boolean {
    let opcoesMesmoProduto = todasOpcoes.filter(op => op.produto.id === opcao.produto.id);
    const fieldCotacao = 'valorCotacao';
    opcoesMesmoProduto.forEach(op => op[fieldCotacao] = context.calculaValorCotacao(op));
    opcoesMesmoProduto = opcoesMesmoProduto.sort((op1, op2) => op1[fieldCotacao] - op2[fieldCotacao]);

    let indiceOpcaoAtual = opcoesMesmoProduto.findIndex(op => op.id === opcao.id);

    return opcoesMesmoProduto[0][fieldCotacao] === opcoesMesmoProduto[indiceOpcaoAtual][fieldCotacao];

  }

  private configuraTabelaAptSemCopart(opcoes: Opcao[]) {
    let opcoesAptoSemCopart = opcoes.filter(op => op.acomodacao === 'Apartamento' && !op.coparticipacao);
    if (this.melhorPrecoProduto) {
      opcoesAptoSemCopart = opcoesAptoSemCopart.filter((op, idx, array) => this.filtraProdutoMenorPreco(op, idx, array, this));
    }
    this.dataSourceCotacaoAptSemCopart = new MatTableDataSource<Opcao>(opcoesAptoSemCopart);
    this.dataSourceCotacaoAptSemCopart.sort = this.sortCotacaoAptSemCopart;
    this.dataSourceCotacaoAptSemCopart.paginator = this.paginatorCotacaoAptSemCopart;
    this.dataSourceCotacaoAptSemCopart.sortingDataAccessor = this.getSortingDataAccessor();
    if (!this.dataSourceCotacaoAptSemCopart.data.length) {
      setTimeout(() => this.panelAptSemCopart.close());
    }
  }

  private configuraTabelaAptComCopart(opcoes: Opcao[]) {
    let opcoesAptComCopart = opcoes.filter(op => op.acomodacao === 'Apartamento' && op.coparticipacao);
    if (this.melhorPrecoProduto) {
      opcoesAptComCopart = opcoesAptComCopart.filter((op, idx, array) => this.filtraProdutoMenorPreco(op, idx, array, this));
    }
    this.dataSourceCotacaoAptComCopart = new MatTableDataSource<Opcao>(opcoesAptComCopart);
    this.dataSourceCotacaoAptComCopart.sort = this.sortCotacaoAptComCopart;
    this.dataSourceCotacaoAptComCopart.paginator = this.paginatorCotacaoAptComCopart;
    this.dataSourceCotacaoAptComCopart.sortingDataAccessor = this.getSortingDataAccessor();
    if (!this.dataSourceCotacaoAptComCopart.data.length) {
      setTimeout(() => this.panelAptComCopart.close());
    }
  }

  private configuraTabelaEnfSemCopart(opcoes: Opcao[]) {
    let opcoesEnfSemCopart = opcoes.filter(op => op.acomodacao === 'Enfermaria' && !op.coparticipacao);
    if (this.melhorPrecoProduto) {
      opcoesEnfSemCopart = opcoesEnfSemCopart.filter((op, idx, array) => this.filtraProdutoMenorPreco(op, idx, array, this));
    }
    this.dataSourceCotacaoEnfSemCopart = new MatTableDataSource<Opcao>(opcoesEnfSemCopart);
    this.dataSourceCotacaoEnfSemCopart.sort = this.sortCotacaoEnfSemCopart;
    this.dataSourceCotacaoEnfSemCopart.paginator = this.paginatorCotacaoEnfSemCopart;
    this.dataSourceCotacaoEnfSemCopart.sortingDataAccessor = this.getSortingDataAccessor();
    if (!this.dataSourceCotacaoEnfSemCopart.data.length) {
      setTimeout(() => this.panelEnfSemCopart.close());
    }
  }

  private configuraTabelaEnfComCopart(opcoes: Opcao[]) {
    let opcoesEnfComCopart = opcoes.filter(op => op.acomodacao === 'Enfermaria' && op.coparticipacao);
    if (this.melhorPrecoProduto) {
      opcoesEnfComCopart = opcoesEnfComCopart.filter((op, idx, array) => this.filtraProdutoMenorPreco(op, idx, array, this));
    }
    this.dataSourceCotacaoEnfComCopart = new MatTableDataSource<Opcao>(opcoesEnfComCopart);
    this.dataSourceCotacaoEnfComCopart.sort = this.sortCotacaoEnfComCopart;
    this.dataSourceCotacaoEnfComCopart.paginator = this.paginatorCotacaoEnfComCopart;
    this.dataSourceCotacaoEnfComCopart.sortingDataAccessor = this.getSortingDataAccessor();
    if (!this.dataSourceCotacaoEnfComCopart.data.length) {
      setTimeout(() => this.panelEnfComCopart.close());
    }
  }

  private getSortingDataAccessor() {
    return (opcao, property) => {
      switch (property) {
        case 'estado':
          return opcao.tabela.estado.sigla;
        case 'tabela':
          return opcao.tabela.nome;
        case 'idadeMin':
          return opcao.tabela.idadeMinima;
        case 'idadeMax':
          return opcao.tabela.idadeMaxima;
        case 'qtdMinVidas':
          return opcao.tabela.qtdMinVidas;
        case 'qtdMinTitulares':
          return opcao.tabela.qtdMinTitulares;
        case 'administradora':
          return opcao.tabela.administradoras?.nome;
        case 'operadora':
          return opcao.tabela.operadora.nome;
        case 'produto':
          return opcao.produto.nome;
        case 'abrangencia':
          return opcao.produto.abrangencia;
        case 'valor0a18anos':
          return opcao.valor0a18anos * this.filtroCotacao.qtdVidas0a18anos;
        case 'valor19a23anos':
          return opcao.valor19a23anos * this.filtroCotacao.qtdVidas19a23anos;
        case 'valor24a28anos':
          return opcao.valor24a28anos * this.filtroCotacao.qtdVidas24a28anos;
        case 'valor29a33anos':
          return opcao.valor29a33anos * this.filtroCotacao.qtdVidas29a33anos;
        case 'valor34a38anos':
          return opcao.valor34a38anos * this.filtroCotacao.qtdVidas34a38anos;
        case 'valor39a43anos':
          return opcao.valor39a43anos * this.filtroCotacao.qtdVidas39a43anos;
        case 'valor44a48anos':
          return opcao.valor44a48anos * this.filtroCotacao.qtdVidas44a48anos;
        case 'valor49a53anos':
          return opcao.valor49a53anos * this.filtroCotacao.qtdVidas49a53anos;
        case 'valor54a58anos':
          return opcao.valor54a58anos * this.filtroCotacao.qtdVidas54a58anos;
        case 'valor59ouMaisAnos':
          return opcao.valor59ouMaisAnos * this.filtroCotacao.qtdVidas59ouMaisAnos;
        case 'valorTotal':
          return this.calculaValorCotacao(opcao);
        case 'reajuste':
          return opcao.tabela.reajuste;
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

    this.profissoesFilteredOptions = this.profissaoAutoCompleteControl.valueChanges.pipe(
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
    this.filtroCotacao.categoria = categoria;
    if (this.isCotacaoAdesao()) {
      this.filtroCotacao.mei = null;
      this.filtroCotacao.tipoAdesao = null;
    } else if (this.isCotacaoEmpresarial()) {
      this.filtroCotacao.profissoes = [];
      this.filtroCotacao.administradoras = [];
    }
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

  configuraDisplayedColumns(): void {
    let columns: string[];

    if (this.modoCliente) {
      columns = [...this.displayedColumnsModoClienteInicio];
    } else {
      columns = [...this.displayedColumnsInicio];
    }

    this.configuraQtdVidas();
    this.adicionaColunasPorQtdVidas(columns);

    if (this.modoCliente) {
      this.displayedColumnsCotacao = columns.concat(this.displayedColumnsModoClienteFim);
    } else {
      this.displayedColumnsCotacao = columns.concat(this.displayedColumnsFim);
    }

    if (this.isCotacaoAdesao() && this.filtroCotacao.profissoes) {
      this.displayedColumnsCotacao.push(...this.filtroCotacao.profissoes.map(p => p.nome));
    }
  }

  private adicionaColunasPorQtdVidas(columns: string[]): string[] {
    if (this.filtroCotacao.qtdVidas0a18anos) {
      columns.push('valor0a18anos')
    }
    if (this.filtroCotacao.qtdVidas19a23anos) {
      columns.push('valor19a23anos')
    }
    if (this.filtroCotacao.qtdVidas24a28anos) {
      columns.push('valor24a28anos')
    }
    if (this.filtroCotacao.qtdVidas29a33anos) {
      columns.push('valor29a33anos')
    }
    if (this.filtroCotacao.qtdVidas34a38anos) {
      columns.push('valor34a38anos')
    }
    if (this.filtroCotacao.qtdVidas39a43anos) {
      columns.push('valor39a43anos')
    }
    if (this.filtroCotacao.qtdVidas44a48anos) {
      columns.push('valor44a48anos')
    }
    if (this.filtroCotacao.qtdVidas49a53anos) {
      columns.push('valor49a53anos')
    }
    if (this.filtroCotacao.qtdVidas54a58anos) {
      columns.push('valor54a58anos')
    }
    if (this.filtroCotacao.qtdVidas59ouMaisAnos) {
      columns.push('valor59ouMaisAnos')
    }

    return columns;
  }

  getNomesEntidadesPorProfissao(opcao: Opcao, profissao: string): string {
    return opcao.tabela.entidades.filter(e => e.profissoes.filter(p => p.nome === profissao).length > 0).map(e => e.valorAssociacao ? e.nome + ': ' + e.valorAssociacao : e.nome).join(' / ');
  }

  getTableWidth(): string {
    return (this.displayedColumnsCotacao?.length * (this.modoCliente ? 150 : 120))  +'px';
  }

  alteraModo(modoCliente: boolean) {
    this.modoCliente = modoCliente;
    this.configuraDisplayedColumns();
    if (this.modoCliente) {
      this.todosProdutosCotacao = this.todasOpcoes.filter(op => op.selected).map(op => op.produto).sort((p1, p2) => p1.operadora.nome.localeCompare(p2.operadora.nome)).filter(UtilService.filtraDuplicadasId);
      this.configuraTabelaEnfComCopart(this.dataSourceCotacaoEnfComCopart.data.filter(op => op.selected));
      this.configuraTabelaEnfSemCopart(this.dataSourceCotacaoEnfSemCopart.data.filter(op => op.selected));
      this.configuraTabelaAptComCopart(this.dataSourceCotacaoAptComCopart.data.filter(op => op.selected));
      this.configuraTabelaAptSemCopart(this.dataSourceCotacaoAptSemCopart.data.filter(op => op.selected));
      this.configuraTabelasAuxiliares();
    } else {
      this.todosProdutosCotacao = this.todasOpcoes.map(op => op.produto).sort((p1, p2) => p1.operadora.nome.localeCompare(p2.operadora.nome)).filter(UtilService.filtraDuplicadasId);
      this.configuraTodasTabelas();
    }
  }

  addProfissao(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    let profissao: Profissao[];

    profissao = this.profissaoFilterAutoComplete(value);

    if (profissao.length === 1) {
      this.filtroCotacao.profissoes = this.filtroCotacao.profissoes.concat(...profissao).filter(UtilService.filtraDuplicadasId);
      if (input) {
        input.value = '';
        this.profissaoAutoCompleteControl.setValue('');
      }
    }
  }

  profissaoSelected(event: MatAutocompleteSelectedEvent): void {
    this.filtroCotacao.profissoes = this.filtroCotacao.profissoes.concat(...this.todasProfissoes.filter(p => p.nome === event.option.viewValue)).filter(UtilService.filtraDuplicadasId);
    this.profissoesInput.nativeElement.value = '';
    this.profissaoAutoCompleteControl.setValue('');
  }

  addIdadeTitular(event: MatChipInputEvent): void {
    this.addIdade(event, this.filtroCotacao.titulares)
  }

  addIdadeDependente(event: MatChipInputEvent): void {
    this.addIdade(event, this.filtroCotacao.dependentes)
  }

  private addIdade(event: MatChipInputEvent, vidas: number[]): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      vidas.push(Number(value));
      this.configuraDisplayedColumns();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeIdadeTitular(idade: any) {
    this.removeFromList(idade, this.filtroCotacao.titulares);
    this.configuraDisplayedColumns();
  }

  removeIdadeDependente(idade: any) {
    this.removeFromList(idade, this.filtroCotacao.dependentes);
    this.configuraDisplayedColumns();
  }

  removeProfissao(profissao: any) {
    this.removeFromList(profissao, this.filtroCotacao.profissoes);
  }

  private removeFromList(item: any, lista: any[]) {
    const index = lista.indexOf(item);

    if (index >= 0) {
      lista.splice(index, 1);
    }
  }

  configuraQtdVidas(): void {
    const vidas = this.filtroCotacao.titulares.concat(this.filtroCotacao.dependentes);

    this.filtroCotacao.qtdVidas0a18anos = vidas.filter(n => n >= 0 && n <= 18).length;
    this.filtroCotacao.qtdVidas19a23anos = vidas.filter(n => n >= 19 && n <= 23).length
    this.filtroCotacao.qtdVidas24a28anos = vidas.filter(n => n >= 24 && n <= 28).length
    this.filtroCotacao.qtdVidas29a33anos = vidas.filter(n => n >= 29 && n <= 33).length
    this.filtroCotacao.qtdVidas34a38anos = vidas.filter(n => n >= 34 && n <= 38).length
    this.filtroCotacao.qtdVidas39a43anos = vidas.filter(n => n >= 39 && n <= 43).length
    this.filtroCotacao.qtdVidas44a48anos = vidas.filter(n => n >= 44 && n <= 48).length
    this.filtroCotacao.qtdVidas49a53anos = vidas.filter(n => n >= 49 && n <= 53).length
    this.filtroCotacao.qtdVidas54a58anos = vidas.filter(n => n >= 54 && n <= 58).length
    this.filtroCotacao.qtdVidas59ouMaisAnos = vidas.filter(n => n >= 59).length
  }

  isCotacaoAdesao(): boolean {
    return this.filtroCotacao.categoria === 'Adesão';
  }

  isCotacaoEmpresarial(): boolean {
    return this.filtroCotacao.categoria === 'Empresarial';
  }

  modelChangeMei(mei: boolean) {
    if (mei) {
      this.filtroCotacao.tipoAdesao = null;
    }
  }

  isBloquearInputs(): boolean {
    return this.todasOpcoes?.length > 0;
  }

  desbloquearInputs(): void {
    this.todasOpcoes = [];
    this.estadoAutoCompleteControl.enable();
    this.configuraTodasTabelas();
    window.history.pushState(null, window.document.title, '#/cotacao/nova');
  }

}
