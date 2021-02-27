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

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private produtoService: ProdutoService,
    private operadoraService: OperadoraService,
  ) {}

  ngOnInit(): void {
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
  }

  editarProduto(): void {
    this.estado = 'editandoProduto';
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.produtoEditando = {...this.produtoSelecionado};
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.produtoSelecionado = null;
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.produtoSelecionado = new Produto();
    this.produtoEditando = this.produtoSelecionado;
  }

  visualizar(): void {
    this.estado = null;
  }

  limpar(): void {
    this.estado = null;
    this.produtoEditando = null;
    this.produtoSelecionado = null;
  }

  editandoProduto(): boolean {
    return this.estado === 'editandoProduto';
  }

  adicionandoProduto(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovoProduto(): void {
    this.produtoService.adicionarProduto(this.produtoEditando).subscribe(response => {
      this.snackBar.openSnackBar('Produto adicionado com sucesso!');
      this.limpar();
      this.carregaTabelaProduto();
    });
  }

  atualizarProduto(): void {
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

}
