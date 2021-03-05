import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatAccordion, MatExpansionPanel} from '@angular/material/expansion';
import {MatTableDataSource} from '@angular/material/table';
import {Operadora} from '../../services/operadora/operadora';
import {FormControl} from '@angular/forms';
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

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.scss']
})
export class TabelaComponent implements OnInit {

  @ViewChild('sortTabela') sortTabela: MatSort;
  @ViewChild('paginatorTabela') paginatorTabela: MatPaginator;

  @ViewChild('sortProduto') sortProduto: MatSort;
  @ViewChild('paginatorProduto') paginatorProduto: MatPaginator;
  @ViewChild('sortProdutoEditando') sortProdutoEditando: MatSort;
  @ViewChild('paginatorProdutoEditando') paginatorProdutoEditando: MatPaginator;

  @ViewChild('sortEntidade') sortEntidade: MatSort;
  @ViewChild('paginatorEntidade') paginatorEntidade: MatPaginator;
  @ViewChild('sortEntidadeEditando') sortEntidadeEditando: MatSort;
  @ViewChild('paginatorEntidadeEditando') paginatorEntidadeEditando: MatPaginator;

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('relacionamentoProduto') accordionProduto: MatExpansionPanel;
  @ViewChild('relacionamentoEntidade') accordionEntidade: MatExpansionPanel;

  displayedColumns: string[] = ['id', 'nome', 'estado', 'operadora', 'administradora'];
  dataSourceTabela = new MatTableDataSource<Tabela>();
  dataSourceProduto = new MatTableDataSource<Produto>();
  dataSourceEntidade = new MatTableDataSource<Entidade>();

  estado: string;
  tabelaEditando: Tabela;
  tabelaSelecionada: Tabela;
  todosEstados: Estado[];
  todasEntidades: Entidade[];
  todosProdutos: Produto[];
  todosReajustes: Reajuste[];
  todasCategorias: Categoria[];
  todasOperadoras: Operadora[];
  todasAdministradoras: Administradora[];

  reajusteAutoCompleteControl = new FormControl();
  estadoAutoCompleteControl = new FormControl();
  operadoraAutoCompleteControl = new FormControl();
  administradoraAutoCompleteControl = new FormControl();
  reajusteFilteredOptions: Observable<Reajuste[]>;
  estadoFilteredOptions: Observable<Estado[]>;
  operadoraFilteredOptions: Observable<Operadora[]>;
  administradoraFilteredOptions: Observable<Administradora[]>;

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private tabelaService: TabelaService,
    private estadoService: EstadoService,
    private entidadeService: EntidadeService,
    private reajusteService: ReajusteService,
    private operadoraService: OperadoraService,
    private categoriaService: CategoriaService,
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
      this.dataSourceTabela = new MatTableDataSource<Tabela>(response);
      this.dataSourceTabela.sort = this.sortTabela;
      this.dataSourceTabela.paginator = this.paginatorTabela;
      this.dataSourceTabela.sortingDataAccessor = (tabela, property) => {
        switch (property) {
          case 'administradora':
            return tabela.administradora.nome;
          case 'estado':
            return tabela.estado.nome;
          case 'operadora':
            return tabela.operadora.nome;
          default:
            return tabela[property];
        }
      };
    });
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
    if (this.editandoTabela() || this.adicionandoTabela()) {
      this.dataSourceProduto.sort = this.sortProdutoEditando;
      this.dataSourceProduto.paginator = this.paginatorProdutoEditando;
    } else {
      this.dataSourceProduto.sort = this.sortProduto;
      this.dataSourceProduto.paginator = this.paginatorProduto;
    }
  }

  private carregaTabelaEntidade(entidades: Entidade[]): void {
    this.dataSourceEntidade = new MatTableDataSource<Entidade>(entidades);
    if (this.editandoTabela() || this.adicionandoTabela()) {
      this.dataSourceEntidade.sort = this.sortEntidadeEditando;
      this.dataSourceEntidade.paginator = this.paginatorEntidadeEditando;
    } else {
      this.dataSourceEntidade.sort = this.sortEntidade;
      this.dataSourceEntidade.paginator = this.paginatorEntidade;
    }
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
    this.carregaTabelasAdicionais(this.tabelaEditando);
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
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.tabelaSelecionada = new Tabela();
    this.tabelaEditando = this.tabelaSelecionada;
    this.reajusteAutoCompleteControl.enable();
    this.estadoAutoCompleteControl.enable();
    this.operadoraAutoCompleteControl.enable();
    this.administradoraAutoCompleteControl.enable();
    this.reajusteAutoCompleteControl.setValue(new Reajuste());
    this.estadoAutoCompleteControl.setValue(new Estado());
    this.operadoraAutoCompleteControl.setValue(new Operadora());
    this.administradoraAutoCompleteControl.setValue(new Administradora());
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
    this.tabelaEditando.estado = this.estadoAutoCompleteControl.value;
    this.tabelaEditando.reajuste = this.reajusteAutoCompleteControl.value;
    this.tabelaEditando.operadora = this.operadoraAutoCompleteControl.value;
    this.tabelaEditando.administradora = this.administradoraAutoCompleteControl.value;
    this.tabelaEditando.produtos = this.todosProdutos.filter(p => p.selected);
    this.tabelaEditando.entidades = this.todasEntidades.filter(e => e.selected);
    this.tabelaService.adicionarTabela(this.tabelaEditando).subscribe(response => {
      this.snackBar.openSnackBar('Tabela adicionado com sucesso!');
      this.limpar();
      this.carregaTabelaTabela();
    });
  }

  private preparaTodosParaNovaVerificacao(): void {
    this.todosProdutos?.forEach(p => p.selected = false);
    this.todasEntidades?.forEach(e => e.selected = false);
  }

  atualizarTabela(): void {
    this.tabelaEditando.estado = this.estadoAutoCompleteControl.value;
    this.tabelaEditando.reajuste = this.reajusteAutoCompleteControl.value;
    this.tabelaEditando.operadora = this.operadoraAutoCompleteControl.value;
    this.tabelaEditando.administradora = this.administradoraAutoCompleteControl.value;
    this.tabelaEditando.produtos = this.todosProdutos.filter(p => p.selected);
    this.tabelaEditando.entidades = this.todasEntidades.filter(e => e.selected);
    this.tabelaService.editarTabela(this.tabelaEditando).subscribe(response => {
      this.snackBar.openSnackBar('Tabela atualizado com sucesso!');
      this.visualizar();
      this.carregaTabelaTabela();
      this.tabelaSelecionada = response;
      this.carregaTabelasAdicionais(this.tabelaSelecionada);
    });
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

}
