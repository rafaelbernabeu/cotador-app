import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatAccordion} from '@angular/material/expansion';
import {MatTableDataSource} from '@angular/material/table';
import {Hospital} from '../../services/hospital/hospital';
import {Laboratorio} from '../../services/laboratorio/laboratorio';
import {Operadora} from '../../services/operadora/operadora';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {HospitalService} from '../../services/hospital/hospital.service';
import {OperadoraService} from '../../services/operadora/operadora.service';
import {LaboratorioService} from '../../services/laboratorio/laboratorio.service';
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

  @ViewChild(MatAccordion) accordion: MatAccordion;

  displayedColumns: string[] = ['id', 'nome', 'estado', 'operadora', 'administradora'];
  dataSourceTabela = new MatTableDataSource<Tabela>();
  dataSourceProduto = new MatTableDataSource<Produto>();

  estado: string;
  tabelaEditando: Tabela;
  tabelaSelecionada: Tabela;
  todosReajustes: Reajuste[];
  todosEstados: Estado[];
  todosProdutos: Produto[];
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
    private reajusteService: ReajusteService,
    private operadoraService: OperadoraService,
    private categoriaService: CategoriaService,
    private administradoraService: AdministradoraService,
  ) {}

  ngOnInit(): void {
    this.iniciaAutoCompletes();
    this.estadoService.getAllEstados().subscribe(response => this.todosEstados = response);
    this.reajusteService.getAllReajustes().subscribe(response => this.todosReajustes = response);
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
          default:
            return tabela[property];
        }
      };
    });
  }

  private carregaTabelaProdutoPorOperadora(): void {
    const operadora = this.operadoraAutoCompleteControl.value;
    if (operadora?.id) {
      this.tabelaEditando.operadora = operadora;
      this.preparaProdutosParaNovaVerificacao();
      this.configuraProdutosParaEdicao();
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
    this.carregaTabelaProduto(this.tabelaEditando.produtos);
  }

  editarTabela(): void {
    this.estado = 'editandoTabela';
    this.reajusteAutoCompleteControl.enable();
    this.estadoAutoCompleteControl.enable();
    this.operadoraAutoCompleteControl.enable();
    this.administradoraAutoCompleteControl.enable();
    this.preparaProdutosParaNovaVerificacao();
    this.configuraProdutosParaEdicao();
  }

  configuraProdutosParaEdicao(): void {
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
    });
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
    this.reajusteAutoCompleteControl.enable();
    this.estadoAutoCompleteControl.enable();
    this.operadoraAutoCompleteControl.enable();
    this.administradoraAutoCompleteControl.enable();
    this.reajusteAutoCompleteControl.setValue(new Reajuste());
    this.estadoAutoCompleteControl.setValue(new Estado());
    this.operadoraAutoCompleteControl.setValue(new Operadora());
    this.administradoraAutoCompleteControl.setValue(new Administradora());
    this.tabelaEditando = this.tabelaSelecionada;
    this.preparaProdutosParaNovaVerificacao();
  }

  visualizar(): void {
    this.estado = null;
    this.estadoAutoCompleteControl.disable();
  }

  limpar(): void {
    this.estado = null;
    this.tabelaEditando = null;
    this.tabelaSelecionada = null;
    this.estadoAutoCompleteControl.disable();
    this.preparaProdutosParaNovaVerificacao();
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
    this.tabelaService.adicionarTabela(this.tabelaEditando).subscribe(response => {
      this.snackBar.openSnackBar('Tabela adicionado com sucesso!');
      this.limpar();
      this.carregaTabelaTabela();
    });
  }

  private preparaProdutosParaNovaVerificacao(): void {
    this.todosProdutos?.forEach(p => p.selected = false);
  }

  atualizarTabela(): void {
    this.tabelaEditando.estado = this.estadoAutoCompleteControl.value;
    this.tabelaEditando.reajuste = this.reajusteAutoCompleteControl.value;
    this.tabelaEditando.operadora = this.operadoraAutoCompleteControl.value;
    this.tabelaEditando.administradora = this.administradoraAutoCompleteControl.value;
    this.tabelaEditando.produtos = this.todosProdutos.filter(p => p.selected);
    this.tabelaService.editarTabela(this.tabelaEditando).subscribe(response => {
      this.snackBar.openSnackBar('Tabela atualizado com sucesso!');
      this.visualizar();
      this.carregaTabelaTabela();
      this.tabelaSelecionada = response;
      this.carregaTabelaProduto(this.tabelaSelecionada.produtos);
    });
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
