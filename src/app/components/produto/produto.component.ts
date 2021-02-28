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

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {

  @ViewChild(MatSort) sortProduto: MatSort;
  @ViewChild(MatPaginator) paginatorProduto: MatPaginator;

  displayedColumns: string[] = ['id', 'nome', 'abrangencia', 'operadora', 'reembolso'];
  dataSourceProduto = new MatTableDataSource<Produto>();

  estado: string;
  produtoEditando: Produto;
  produtoSelecionado: Produto;
  todasOperadoras: Operadora[];
  autoCompleteControl = new FormControl();
  filteredOptions: Observable<Operadora[]>;

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private produtoService: ProdutoService,
    private operadoraService: OperadoraService,
  ) {}

  ngOnInit(): void {
    this.autoCompleteControl.disable();
    this.filteredOptions = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.filterAutoComplete(value))
    );

    this.operadoraService.getAllOperadoras().subscribe(response => this.todasOperadoras = response);
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

  selecionaProduto(produto: Produto): void {
    this.estado = null;
    this.produtoSelecionado = produto;
    this.produtoEditando = {...produto};
    this.autoCompleteControl.disable();
    this.autoCompleteControl.setValue(this.produtoEditando.operadora);
  }

  editarProduto(): void {
    this.estado = 'editandoProduto';
    this.autoCompleteControl.enable();
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
    this.autoCompleteControl.setValue(null);
    this.produtoEditando = this.produtoSelecionado;
    this.autoCompleteControl.enable();
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

  atualizarProduto(): void {
    this.produtoEditando.operadora = this.autoCompleteControl.value;
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
    const filterValue = value.toLowerCase();
    return this.todasOperadoras.filter(operadora => operadora.nome.toLowerCase().includes(filterValue));
  }

  displayFn(operadora: Operadora): string {
    return operadora && operadora.nome ? operadora.nome : '';
  }
}
