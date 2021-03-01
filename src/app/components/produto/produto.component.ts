import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {ProdutoService} from '../../services/produto/produto.service';
import {DialogComponent} from '../dialog/dialog.component';
import {Produto} from '../../services/produto/produto';
import {Operadora} from '../../services/operadora/operadora';
import {OperadoraService} from '../../services/operadora/operadora.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAccordion} from '@angular/material/expansion';
import {Laboratorio} from '../../services/laboratorio/laboratorio';
import {LaboratorioService} from '../../services/laboratorio/laboratorio.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {

  @ViewChild('sortProduto') sortProduto: MatSort;
  @ViewChild('paginatorProduto') paginatorProduto: MatPaginator;

  @ViewChild('sortLaboratorio') sortLaboratorio: MatSort;
  @ViewChild('paginatorLaboratorio') paginatorLaboratorio: MatPaginator;

  @ViewChild(MatAccordion) accordion: MatAccordion;

  displayedColumns: string[] = ['id', 'nome', 'abrangencia', 'operadora', 'reembolso'];
  dataSourceProduto = new MatTableDataSource<Produto>();
  dataSourceLaboratorio = new MatTableDataSource<Laboratorio>();

  estado: string;
  produtoEditando: Produto;
  produtoSelecionado: Produto;
  todasOperadoras: Operadora[];
  todosLaboratorios: Laboratorio[];
  autoCompleteControl = new FormControl();
  filteredOptions: Observable<Operadora[]>;

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private produtoService: ProdutoService,
    private operadoraService: OperadoraService,
    private laboratorioService: LaboratorioService,
  ) {}

  ngOnInit(): void {
    this.autoCompleteControl.disable();
    this.filteredOptions = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.filterAutoComplete(value))
    );

    this.operadoraService.getAllOperadoras().subscribe(response => this.todasOperadoras = response);
    this.laboratorioService.getAllLaboratorios().subscribe(response => this.todosLaboratorios = response);
    this.carregaTabelaProduto();
  }

  operadoraComparator(operadora1: Operadora, operadora2: Operadora): boolean {
    return operadora1.id === operadora2.id;
  }

  private carregaTabelaProduto(): void {
    this.produtoService.getAllProdutos().subscribe(response => {
        this.dataSourceProduto = new MatTableDataSource<Produto>(response);
        this.dataSourceProduto.sort = this.sortProduto;
        this.dataSourceProduto.paginator = this.paginatorProduto;
      }
    );
  }

  private carregaTabelaLaboratorio(laboratorios: Laboratorio[]): void {
    this.dataSourceLaboratorio = new MatTableDataSource<Laboratorio>(laboratorios);
    this.dataSourceLaboratorio.sort = this.sortLaboratorio;
    this.dataSourceLaboratorio.paginator = this.paginatorLaboratorio;
  }

  selecionaProduto(produto: Produto): void {
    this.estado = null;
    this.produtoSelecionado = produto;
    this.produtoEditando = {...produto};
    this.autoCompleteControl.disable();
    this.autoCompleteControl.setValue(this.produtoEditando.operadora);
    this.carregaTabelaLaboratorio(this.produtoEditando.laboratorios);
    this.preparaTodosLaboratoriosParaNovaVerificacao();
  }

  editarProduto(): void {
    this.estado = 'editandoProduto';
    this.autoCompleteControl.enable();
    this.configuraLaboratoriosParaEdicao();
  }

  configuraLaboratoriosParaEdicao(): void {
    this.todosLaboratorios.forEach(todos => {
      this.produtoSelecionado.laboratorios.forEach(laboratorio => {
        if (todos.id === laboratorio.id) {
          todos.selected = true;
        }
      });
    });
    this.carregaTabelaLaboratorio(this.todosLaboratorios);
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.produtoEditando = {...this.produtoSelecionado};
    this.autoCompleteControl.disable();
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.produtoSelecionado = null;
    this.autoCompleteControl.disable();
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.produtoSelecionado = new Produto();
    this.autoCompleteControl.enable();
    this.autoCompleteControl.setValue(new Operadora());
    this.produtoEditando = this.produtoSelecionado;
  }

  visualizar(): void {
    this.estado = null;
    this.autoCompleteControl.disable();
  }

  limpar(): void {
    this.estado = null;
    this.produtoEditando = null;
    this.produtoSelecionado = null;
    this.autoCompleteControl.disable();
    this.preparaTodosLaboratoriosParaNovaVerificacao();
  }

  editandoProduto(): boolean {
    return this.estado === 'editandoProduto';
  }

  adicionandoProduto(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovoProduto(): void {
    this.produtoEditando.operadora = this.autoCompleteControl.value;
    this.produtoService.adicionarProduto(this.produtoEditando).subscribe(response => {
      this.snackBar.openSnackBar('Produto adicionado com sucesso!');
      this.limpar();
      this.carregaTabelaProduto();
    });
  }

  private preparaTodosLaboratoriosParaNovaVerificacao(): void {
    this.todosLaboratorios.forEach(p => p.selected = false);
  }

  atualizarProduto(): void {
    this.produtoEditando.operadora = this.autoCompleteControl.value;
    this.produtoEditando.laboratorios = this.todosLaboratorios.filter(l => l.selected);
    this.produtoService.editarProduto(this.produtoEditando).subscribe(response => {
      this.snackBar.openSnackBar('Produto atualizado com sucesso!');
      this.visualizar();
      this.carregaTabelaProduto();
      this.produtoSelecionado = response;
    });
  }

  removerProduto(): void {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Tem certeza?',
        descricao: 'Deseja remover o produto ' + this.produtoSelecionado.nome + '?',
        confirma: 'Sim',
        cancela: 'Nao',
      }
    }).afterClosed().subscribe(confirmacao => {
      if (confirmacao) {
        this.produtoService.excluirProduto(this.produtoSelecionado).subscribe(response => {
          this.snackBar.openSnackBar('Produto apagado com sucesso!');
          this.limpar();
          this.carregaTabelaProduto();
        });
      }
    });
  }

  private filterAutoComplete(value: string): Operadora[] {
    const filterValue = value?.toLowerCase();
    return this.todasOperadoras.filter(operadora => operadora.nome.toLowerCase().includes(filterValue));
  }

  displayFn(operadora: Operadora): string {
    return operadora && operadora.nome ? operadora.nome : '';
  }
}
