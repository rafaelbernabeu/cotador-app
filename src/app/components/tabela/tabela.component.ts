import {Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatAccordion, MatExpansionPanel} from '@angular/material/expansion';
import {MatTableDataSource} from '@angular/material/table';
import {Operadora} from '../../services/operadora/operadora';
import {FormControl, NgForm, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {OperadoraService} from '../../services/operadora/operadora.service';
import {map, startWith} from 'rxjs/operators';
import {DialogComponent} from '../dialog/dialog.component';
import {TabelaService} from '../../services/tabela/tabela.service';
import {Tabela} from '../../services/tabela/tabela';
import {Estado} from '../../services/estado/estado';
import {EstadoService} from '../../services/estado/estado.service';
import {CategoriaService} from '../../services/categoria/categoria.service';
import {Categoria} from '../../services/categoria/categoria';
import {AdministradoraService} from '../../services/administradora/administradora.service';
import {Administradora} from '../../services/administradora/administradora';
import {Produto} from '../../services/produto/produto';
import {Reajuste} from '../../services/reajuste/reajuste';
import {ReajusteService} from '../../services/reajuste/reajuste.service';
import {Entidade} from '../../services/entidade/entidade';
import {EntidadeService} from '../../services/entidade/entidade.service';
import {Profissao} from "../../services/profissao/profissao";
import {ProfissaoService} from "../../services/profissao/profissao.service";
import {FiltroTabela} from "../../services/tabela/filtro-tabela";
import {UtilService} from "../../services/util/util.service";

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.scss']
})
export class TabelaComponent implements OnInit {

  @ViewChild('formTabela') formTabela: NgForm;
  @ViewChild('sortTabela') sortTabela: MatSort;
  @ViewChild('paginatorTabela') paginatorTabela: MatPaginator;

  @ViewChild('sortProduto') sortProduto: MatSort;
  @ViewChild('paginatorProduto') paginatorProduto: MatPaginator;

  @ViewChild('sortEntidade') sortEntidade: MatSort;
  @ViewChild('paginatorEntidade') paginatorEntidade: MatPaginator;

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('relacionamentoProduto') accordionProduto: MatExpansionPanel;
  @ViewChild('relacionamentoEntidade') accordionEntidade: MatExpansionPanel;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if ((this.adicionandoTabela() || this.editandoTabela()) && event.code === 'Enter') {
        event.preventDefault();
        this.onSubmit();
      } else if (event.code === 'KeyA') {
        event.preventDefault();
        this.adicionar();
      } else if (event.code === 'KeyB') {
        event.preventDefault();
        this.filtrar()
      } else if (this.tabelaSelecionada) {
        if (event.code === 'KeyD') {
          event.preventDefault();
          this.copiarTabela();
        } else if (event.code === 'KeyE') {
          event.preventDefault();
          this.editarTabela();
        }
      }
    } else if (event.code === 'Escape') {
      if (this.editandoTabela()) {
        event.preventDefault();
        this.cancelarEdicao();
      } else if (this.filtrandoTabela()) {
        event.preventDefault();
        this.cancelarFiltro()
      } else {
        event.preventDefault();
        this.cancelarAdicao();
      }
    }
  }

  displayedColumns: string[] = ['id', 'nome', 'estado', 'operadora', 'administradora', "reajuste", "idadeMinima", "idadeMaxima", "qtdMinVidas", "qtdMinTitulares"];
  dataSourceTabela = new MatTableDataSource<Tabela>();
  dataSourceProduto = new MatTableDataSource<Produto>();
  dataSourceEntidade = new MatTableDataSource<Entidade>();

  estado: string;
  tabelaEditando: Tabela;
  tabelaSelecionada: Tabela;
  todasTabelas: Tabela[];
  todosEstados: Estado[];
  todosProdutos: Produto[];
  todasEntidades: Entidade[];
  todosReajustes: Reajuste[];
  todasProfissoes: Profissao[];
  todasCategorias: Categoria[];
  todasOperadoras: Operadora[];
  todasAdministradoras: Administradora[];

  todosEstadosTabela: Estado[];
  todasOperadorasTabela: Operadora[];
  todasAdministradorasTabela: Administradora[];
  filtroTabela: FiltroTabela = new FiltroTabela();

  reajusteAutoCompleteControl = new FormControl(Validators.required);
  estadoAutoCompleteControl = new FormControl(Validators.required);
  operadoraAutoCompleteControl = new FormControl(Validators.required);
  administradoraAutoCompleteControl = new FormControl(Validators.required);
  reajusteFilteredOptions: Observable<Reajuste[]>;
  estadoFilteredOptions: Observable<Estado[]>;
  operadoraFilteredOptions: Observable<Operadora[]>;
  administradoraFilteredOptions: Observable<Administradora[]>;

  constructor(
    @Inject('Window') public window: Window,

    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private tabelaService: TabelaService,
    private estadoService: EstadoService,
    private entidadeService: EntidadeService,
    private reajusteService: ReajusteService,
    private operadoraService: OperadoraService,
    private categoriaService: CategoriaService,
    private profissaoService: ProfissaoService,
    private administradoraService: AdministradoraService,
  ) {}

  ngOnInit(): void {
    this.iniciaAutoCompletes();
    this.estadoService.getAllEstados().subscribe(response => this.todosEstados = response);
    this.reajusteService.getAllReajustes().subscribe(response => this.todosReajustes = response);
    this.entidadeService.getAllEntidades().subscribe(response => this.todasEntidades = response);
    this.categoriaService.getAllCategorias().subscribe(response => this.todasCategorias = response);
    this.operadoraService.getAllOperadoras().subscribe(response => this.todasOperadoras = response);
    this.administradoraService.getAllAdministradoras().subscribe(response => this.todasAdministradoras = response);
    this.profissaoService.getAllProfissoes().subscribe(response => {
      this.todasProfissoes = response
      this.displayedColumns.push(...this.todasProfissoes.map(p => p.nome));
    })
    this.carregaTabelaTabela();
  }

  private iniciaAutoCompletes(): void {
    this.estadoAutoCompleteControl.disable();
    this.estadoFilteredOptions = this.estadoAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.estadoFilterAutoComplete(value))
    );
    this.administradoraFilteredOptions = this.administradoraAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.administradoraFilterAutoComplete(value))
    );
    this.operadoraFilteredOptions = this.operadoraAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.operadoraFilterAutoComplete(value))
    );
    this.reajusteFilteredOptions = this.reajusteAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.reajusteFilterAutoComplete(value))
    );
  }

  private carregaTabelaTabela(): void {
    this.tabelaService.getAllTabelas().subscribe(response => {
      this.todasTabelas = response;
      this.configuraTabelaTabela(response);

    });
  }

  private configuraTabelaTabela(tabelas: Tabela[]): void {
    this.dataSourceTabela = new MatTableDataSource<Tabela>(tabelas);
    this.dataSourceTabela.sort = this.sortTabela;
    this.dataSourceTabela.paginator = this.paginatorTabela;
    this.dataSourceTabela.sortingDataAccessor = (tabela, property) => {
      switch (property) {
        case 'administradora':
          return tabela.administradora?.nome;
        case 'estado':
          return tabela.estado.nome;
        case 'operadora':
          return tabela.operadora.nome;
        default:
          return tabela[property];
      }
    };
  }

  private carregaTabelaProdutoPorOperadora(): void {
    if (this.adicionandoTabela() || this.editandoTabela()) {
      const operadora = this.operadoraAutoCompleteControl.value;
      if (operadora?.id) {
        this.tabelaEditando.operadora = operadora;
        this.preparaTodosParaNovaVerificacao();
        this.configuraProdutosParaEdicao();
      }
    }
  }

  private carregaTabelaProduto(produtos: Produto[]): void {
    this.dataSourceProduto = new MatTableDataSource<Produto>(produtos);
    this.dataSourceProduto.sort = this.sortProduto;
    this.dataSourceProduto.paginator = this.paginatorProduto;
    this.dataSourceProduto.sortingDataAccessor = (produto, property) => {
      switch (property) {
        case 'idProduto':
          return produto.id;
        case 'nomeProduto':
          return produto.nome;
        case 'abrangenciaProduto':
          return produto.abrangencia;
        default:
          return produto[property];
      }
    };
  }

  private readonly columnsProduto = ['idProduto', 'nomeProduto', 'abrangenciaProduto'];
  getColumnsProduto(): string[] {
    if (this.adicionandoTabela() || this.editandoTabela()) {
      return this.columnsProduto.concat('selected');
    }
    return this.columnsProduto;
  }

  private carregaTabelaEntidade(entidades: Entidade[]): void {
    entidades.forEach(e => e["nomesProfissoes"] = e.profissoes.map(this.getNomeProfissao).join(', '))
    this.dataSourceEntidade = new MatTableDataSource<Entidade>(entidades);
    this.dataSourceEntidade.sort = this.sortEntidade;
    this.dataSourceEntidade.paginator = this.paginatorEntidade;
    this.dataSourceEntidade.sortingDataAccessor = (entidade, property) => {
      switch (property) {
        case 'idEntidade':
          return entidade.id;
        case 'nomeEntidade':
          return entidade.nome;
        case 'profissoesEntidade':
          return entidade.profissoes.map(p => p.nome).join(', ');
        default:
          return entidade[property];
      }
    };
  }

  private readonly columnsEntidade = ['idEntidade', 'nomeEntidade', 'profissoesEntidade'];
  getColumnsEntidade(): string[] {
    if (this.adicionandoTabela() || this.editandoTabela()) {
      return this.columnsEntidade.concat('selected');
    }
    return this.columnsEntidade;
  }

  selecionaTabela(tabela: Tabela): void {
    this.estado = null;
    this.tabelaSelecionada = tabela;
    this.tabelaEditando = {...tabela};
    this.reajusteAutoCompleteControl.disable();
    this.estadoAutoCompleteControl.disable();
    this.operadoraAutoCompleteControl.disable();
    this.administradoraAutoCompleteControl.disable();
    this.reajusteAutoCompleteControl.setValue(this.tabelaEditando.reajuste);
    this.estadoAutoCompleteControl.setValue(this.tabelaEditando.estado);
    this.operadoraAutoCompleteControl.setValue(this.tabelaEditando.operadora);
    this.administradoraAutoCompleteControl.setValue(this.tabelaEditando.administradora);
    this.paginatorTabela._changePageSize(10);
    this.carregaTabelasAdicionais(this.tabelaEditando);
    this.editarTabela();
  }

  copiarTabela(): void {
    this.editarTabela();
    this.tabelaEditando.id = null;
    this.tabelaEditando.nome = '';
    this.estado = 'adicionando';
  }

  editarTabela(): void {
    this.estado = 'editandoTabela';
    this.reajusteAutoCompleteControl.enable();
    this.estadoAutoCompleteControl.enable();
    this.operadoraAutoCompleteControl.enable();
    this.administradoraAutoCompleteControl.enable();
    this.preparaTodosParaNovaVerificacao();
    this.configuraProdutosParaEdicao();
    this.configuraEntidadesParaEdicao();
  }

  configuraProdutosParaEdicao(): void {
    if (this.tabelaEditando.operadora?.id) {
      this.operadoraService.getProdutosByOperadora(this.tabelaEditando.operadora).subscribe(response => {
        this.todosProdutos = response;
        this.todosProdutos.forEach(todos => {
          this.tabelaSelecionada.produtos?.forEach(produto => {
            if (todos.id === produto.id) {
              todos.selected = true;
            }
          });
        });
        this.carregaTabelaProduto(this.todosProdutos);
        this.accordionProduto.open();
      });
    }
  }

  configuraEntidadesParaEdicao(): void {
    this.todasEntidades.forEach(todas => {
      this.tabelaSelecionada.entidades?.forEach(entidade => {
        if (todas.id === entidade.id) {
          todas.selected = true;
        }
      });
    });
    this.carregaTabelaEntidade(this.todasEntidades);
    this.accordionEntidade.open();
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.tabelaEditando = {...this.tabelaSelecionada};
    this.reajusteAutoCompleteControl.disable();
    this.estadoAutoCompleteControl.disable();
    this.operadoraAutoCompleteControl.disable();
    this.administradoraAutoCompleteControl.disable();
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.tabelaSelecionada = null;
    this.reajusteAutoCompleteControl.disable();
    this.estadoAutoCompleteControl.disable();
    this.operadoraAutoCompleteControl.disable();
    this.administradoraAutoCompleteControl.disable();
    this.paginatorTabela._changePageSize(20);
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.formTabela?.resetForm();
    this.tabelaSelecionada = new Tabela();
    this.tabelaEditando = this.tabelaSelecionada;
    this.reajusteAutoCompleteControl.enable();
    this.estadoAutoCompleteControl.enable();
    this.operadoraAutoCompleteControl.enable();
    this.administradoraAutoCompleteControl.enable();
    this.reajusteAutoCompleteControl.setValue('');
    this.estadoAutoCompleteControl.setValue('');
    this.operadoraAutoCompleteControl.setValue('');
    this.administradoraAutoCompleteControl.setValue('');
    this.reajusteAutoCompleteControl.markAsPristine();
    this.estadoAutoCompleteControl.markAsPristine();
    this.operadoraAutoCompleteControl.markAsPristine();
    this.administradoraAutoCompleteControl.markAsPristine();
    this.reajusteAutoCompleteControl.markAsUntouched();
    this.estadoAutoCompleteControl.markAsUntouched();
    this.operadoraAutoCompleteControl.markAsUntouched();
    this.administradoraAutoCompleteControl.markAsUntouched();
    this.paginatorTabela._changePageSize(10);
    this.preparaTodosParaNovaVerificacao();
    this.accordionProduto.close();
    this.accordionEntidade.open();
    this.configuraEntidadesParaEdicao();
  }

  visualizar(): void {
    this.estado = null;
    this.estadoAutoCompleteControl.disable();
    this.reajusteAutoCompleteControl.disable();
    this.operadoraAutoCompleteControl.disable();
    this.administradoraAutoCompleteControl.disable();
  }

  limpar(): void {
    this.estado = null;
    this.tabelaEditando = null;
    this.tabelaSelecionada = null;
    this.estadoAutoCompleteControl.disable();
    this.reajusteAutoCompleteControl.disable();
    this.operadoraAutoCompleteControl.disable();
    this.administradoraAutoCompleteControl.disable();
    this.preparaTodosParaNovaVerificacao();
  }

  editandoTabela(): boolean {
    return this.estado === 'editandoTabela';
  }

  adicionandoTabela(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovaTabela(): void {
    this.tabelaEditando.produtos = this.todosProdutos.filter(p => p.selected);
    this.tabelaEditando.entidades = this.todasEntidades.filter(e => e.selected);
    if (this.isFormValido()) {
      this.tabelaEditando.estado = this.estadoAutoCompleteControl.value;
      this.tabelaEditando.reajuste = this.reajusteAutoCompleteControl.value;
      this.tabelaEditando.operadora = this.operadoraAutoCompleteControl.value;
      this.tabelaEditando.administradora = this.administradoraAutoCompleteControl.value ? this.administradoraAutoCompleteControl.value : null;
      this.tabelaService.adicionarTabela(this.tabelaEditando).subscribe(response => {
        this.snackBar.openSnackBar('Tabela adicionado com sucesso!');
        this.limpar();
        this.carregaTabelaTabela();
      });
    } else {
      this.erroFormInvalido();
    }
  }

  private preparaTodosParaNovaVerificacao(): void {
    this.todosProdutos?.forEach(p => p.selected = false);
    this.todasEntidades?.forEach(e => e.selected = false);
  }

  atualizarTabela(): void {
    this.tabelaEditando.produtos = this.todosProdutos.filter(p => p.selected);
    this.tabelaEditando.entidades = this.todasEntidades.filter(e => e.selected);
    if (this.isFormValido()) {
      this.tabelaEditando.estado = this.estadoAutoCompleteControl.value;
      this.tabelaEditando.reajuste = this.reajusteAutoCompleteControl.value;
      this.tabelaEditando.operadora = this.operadoraAutoCompleteControl.value;
      this.tabelaEditando.administradora = this.administradoraAutoCompleteControl.value ? this.administradoraAutoCompleteControl.value : null;
      this.tabelaService.editarTabela(this.tabelaEditando).subscribe(response => {
        this.snackBar.openSnackBar('Tabela atualizado com sucesso!');
        this.visualizar();
        this.carregaTabelaTabela();
        this.tabelaSelecionada = response;
        this.carregaTabelasAdicionais(this.tabelaSelecionada);
      });
    } else {
      this.erroFormInvalido();
    }
  }

  private erroFormInvalido(): void {
    this.formTabela.form.markAllAsTouched();
    if (this.isCategoriaAdesao() && !this.administradoraAutoCompleteControl.value.id) {
      this.administradoraAutoCompleteControl.setValue('');
      this.administradoraAutoCompleteControl.markAllAsTouched();
    }
    if (!this.estadoAutoCompleteControl.value.sigla){
      this.estadoAutoCompleteControl.setValue('');
      this.estadoAutoCompleteControl.markAllAsTouched();
    }
    if (!this.operadoraAutoCompleteControl.value.id){
      this.operadoraAutoCompleteControl.setValue('');
      this.operadoraAutoCompleteControl.markAllAsTouched();
    }
    if (!this.reajusteAutoCompleteControl.value){
      this.reajusteAutoCompleteControl.setValue('');
      this.reajusteAutoCompleteControl.markAllAsTouched();
    }
    this.snackBar.openSnackBar("Preencha todos os campos!");
  }

  private carregaTabelasAdicionais(tabela: Tabela): void {
    this.carregaTabelaProduto(tabela.produtos);
    this.carregaTabelaEntidade(tabela.entidades);
  }

  removerTabela(): void {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Tem certeza?',
        descricao: 'Deseja remover o produto ' + this.tabelaSelecionada.nome + '?',
        confirma: 'Sim',
        cancela: 'Nao',
      }
    }).afterClosed().subscribe(confirmacao => {
      if (confirmacao) {
        this.tabelaService.excluirTabela(this.tabelaSelecionada).subscribe(response => {
          this.snackBar.openSnackBar('Tabela apagado com sucesso!');
          this.limpar();
          this.carregaTabelaTabela();
        });
      }
    });
  }

  private reajusteFilterAutoComplete(value: string): Reajuste[] {
    const filterValue = value?.toLowerCase();
    return this.todosReajustes.filter(reajuste => reajuste.toLowerCase().includes(filterValue));
  }

  private estadoFilterAutoComplete(value: string): Estado[] {
    const filterValue = value?.toLowerCase();
    return this.todosEstados.filter(estado => estado.nome.toLowerCase().includes(filterValue) || estado.sigla.toLowerCase().includes(filterValue));
  }

  private administradoraFilterAutoComplete(value: string): Administradora[] {
    const filterValue = value?.toLowerCase();
    return this.todasAdministradoras.filter(adminstradora => adminstradora.nome.toLowerCase().includes(filterValue));
  }

  private operadoraFilterAutoComplete(value: string): Operadora[] {
    const filterValue = value?.toLowerCase();
    return this.todasOperadoras.filter(operadora => operadora.nome.toLowerCase().includes(filterValue));
  }

  reajusteDisplayFn(reajuste: Reajuste): string {
    return reajuste ? reajuste.toString() : '';
  }

  estadoDisplayFn(estado: Estado): string {
    return estado && estado.nome ? estado.nome : '';
  }

  administradoraDisplayFn(administradora: Administradora): string {
    return administradora && administradora.nome ? administradora.nome : '';
  }

  operadoraDisplayFn(operadora: Operadora): string {
    return operadora && operadora.nome ? operadora.nome : '';
  }

  categoriaEmpresarial(): boolean {
    return this.tabelaEditando.categoria === 'Empresarial';
  }

  getNomesEntidadesPorProfissao(tabela: Tabela, profissao: string): string {
    let nomes = tabela.entidades.filter(e => e.profissoes.filter(p => p.nome === profissao).length > 0).map(e => e.nome).join(' / ');
    return nomes ? nomes : '--';
  }

  getTableWidth(): string {
    return (this.displayedColumns?.length * 125)  +'px';
  }

  isCategoriaEmpresarial(): boolean {
    return this.tabelaEditando?.categoria === 'Empresarial';
  }

  isCategoriaAdesao(): boolean {
    return this.tabelaEditando?.categoria === 'Adesão';
  }

  modelChangeCategoria(categoria: string) {
    this.tabelaEditando.categoria = categoria;
    if (this.isCategoriaEmpresarial()) {
      this.administradoraAutoCompleteControl.setValue('');
    }
  }

  filtrandoTabela(): boolean {
    return this.estado === 'filtrando';
  }

  filtrar(): void {
    this.todosEstadosTabela = this.todasTabelas.map(t => t.estado).filter(UtilService.filtraDuplicadasNome);
    this.todasOperadorasTabela = this.todasTabelas.map(t => t.operadora).filter(UtilService.filtraDuplicadasId);
    this.todasAdministradorasTabela = this.todasTabelas.filter(t => t.administradora).map(t => t.administradora).filter(UtilService.filtraDuplicadasId);

    this.estado = 'filtrando';
    this.tabelaSelecionada = null;
  }

  filtraTabela() {
    setTimeout(() => {
      let tabelasFiltradas = this.todasTabelas;

      if (this.filtroTabela.categoria) {
        tabelasFiltradas = tabelasFiltradas.filter(t => t.categoria === this.filtroTabela.categoria);

        if (this.filtroTabela.categoria === 'Adesão' && this.filtroTabela.administradoras.length) {
            tabelasFiltradas = tabelasFiltradas.filter(t => t.administradora).filter(t => this.filtroTabela.administradoras.filter(adm => adm.id === t.administradora.id).length);
        } else if (this.filtroTabela.categoria === 'Empresarial') {

          if (this.filtroTabela.contemplaMEI != null && typeof this.filtroTabela.contemplaMEI === 'boolean') {
            tabelasFiltradas = tabelasFiltradas.filter(t => t.contemplaMEI === this.filtroTabela.contemplaMEI);
          }

          if (this.filtroTabela.livreAdesao != null) {
            tabelasFiltradas = tabelasFiltradas.filter(t => t.livreAdesao === this.filtroTabela.livreAdesao);
          }

          if (this.filtroTabela.compulsoria != null) {
            tabelasFiltradas = tabelasFiltradas.filter(t => t.compulsoria === this.filtroTabela.compulsoria);
          }
        }
      }

      if (this.filtroTabela.nome) {
        tabelasFiltradas = tabelasFiltradas.filter(t => t.nome.toLowerCase().includes(this.filtroTabela.nome.toLowerCase()));
      }

      if (this.filtroTabela.estados.length) {
        tabelasFiltradas = tabelasFiltradas.filter(t => this.filtroTabela.estados.filter(e => e.sigla === t.estado.sigla).length);
      }

      if (this.filtroTabela.operadoras.length) {
        tabelasFiltradas = tabelasFiltradas.filter(t => this.filtroTabela.operadoras.filter(op => op.id === t.operadora.id).length);
      }

      if (this.filtroTabela.reajustes.length) {
        tabelasFiltradas = tabelasFiltradas.filter(t => this.filtroTabela.reajustes.filter(r => r === t.reajuste).length);
      }

      if (this.filtroTabela.profissoes.length) {
        tabelasFiltradas = tabelasFiltradas.filter(t => t.entidades.filter(e => e.profissoes.filter(p => this.filtroTabela.profissoes.filter(fp => p.id === fp.id).length).length).length);
      }

      if (this.filtroTabela.tipoFiltro) {

        tabelasFiltradas = UtilService.filtraListaPorValorProperty(tabelasFiltradas, this.filtroTabela, 'qtdMinVidas');
        tabelasFiltradas = UtilService.filtraListaPorValorProperty(tabelasFiltradas, this.filtroTabela, 'qtdMinTitulares');
        tabelasFiltradas = UtilService.filtraListaPorValorProperty(tabelasFiltradas, this.filtroTabela, 'idadeMinima');
        tabelasFiltradas = UtilService.filtraListaPorValorProperty(tabelasFiltradas, this.filtroTabela, 'idadeMaxima');

      }

      this.configuraTabelaTabela(tabelasFiltradas);

    });
  }

  cancelarFiltro(): void {
    this.cancelarAdicao();
  }

  limparFiltro(): void {
    this.filtroTabela = new FiltroTabela();
    this.filtraTabela();
  }

  onSubmit(): void {
    if (this.adicionandoTabela()) {
      this.salvarNovaTabela();
    } else if (this.editandoTabela()) {
      this.atualizarTabela();
    }
  }

  isFormValido(): boolean {
    if (!this.todosReajustes.some(r => r === this.reajusteAutoCompleteControl.value)) {
      this.reajusteAutoCompleteControl.setValue('');
    }

    if (this.isCategoriaAdesao()) {
      return this.formTabela.valid &&
        this.estadoAutoCompleteControl.valid && this.estadoAutoCompleteControl.value.sigla &&
        this.administradoraAutoCompleteControl.valid && this.administradoraAutoCompleteControl.value.id &&
        this.operadoraAutoCompleteControl.valid && this.operadoraAutoCompleteControl.value.id &&
        this.reajusteAutoCompleteControl.valid && this.reajusteAutoCompleteControl.value &&
        this.tabelaEditando.produtos.length > 0 && this.tabelaEditando.entidades.length > 0;
    } else if (this.isCategoriaEmpresarial()) {
      return this.formTabela.valid &&
        this.estadoAutoCompleteControl.valid && this.estadoAutoCompleteControl.value.sigla &&
        this.operadoraAutoCompleteControl.valid && this.operadoraAutoCompleteControl.value.id &&
        this.reajusteAutoCompleteControl.valid && this.reajusteAutoCompleteControl.value &&
        this.tabelaEditando.produtos.length > 0;
    }
    return false;
  }

  getNomeProfissao(profissao: Profissao): string {
    return profissao.nome;
  }

  applyFilterProduto(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProduto.filter = filterValue.trim().toLowerCase();
  }

  applyFilterEntidade(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEntidade.filter = filterValue.trim().toLowerCase();
  }
}
