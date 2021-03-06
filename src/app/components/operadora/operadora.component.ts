import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {OperadoraService} from '../../services/operadora/operadora.service';
import {DialogComponent} from '../dialog/dialog.component';
import {Operadora} from '../../services/operadora/operadora';

@Component({
  selector: 'app-operadora',
  templateUrl: './operadora.component.html',
  styleUrls: ['./operadora.component.scss']
})
export class OperadoraComponent implements OnInit {

  @ViewChild(MatSort) sortOperadora: MatSort;
  @ViewChild(MatPaginator) paginatorOperadora: MatPaginator;

  displayedColumns: string[] = ['id', 'nome', 'cor'];
  dataSourceOperadora = new MatTableDataSource<Operadora>();

  estado: string;
  operadoraEditando: Operadora;
  operadoraSelecionada: Operadora;

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private operadoraService: OperadoraService,
  ) {}

  ngOnInit(): void {
    this.carregaTabelaOperadora();
  }

  private carregaTabelaOperadora(): void {
    this.operadoraService.getAllOperadoras().subscribe(response => {
        this.dataSourceOperadora = new MatTableDataSource<Operadora>(response);
        this.dataSourceOperadora.sort = this.sortOperadora;
        this.dataSourceOperadora.paginator = this.paginatorOperadora;
      }
    );
  }

  selecionaOperadora(operadora: Operadora): void {
    this.estado = null;
    this.operadoraSelecionada = operadora;
    this.operadoraEditando = {...operadora};
  }

  editarOperadora(): void {
    this.estado = 'editandoOperadora';
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.operadoraEditando = {...this.operadoraSelecionada};
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.operadoraSelecionada = null;
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.operadoraSelecionada = new Operadora();
    this.operadoraEditando = this.operadoraSelecionada;
  }

  visualizar(): void {
    this.estado = null;
  }

  limpar(): void {
    this.estado = null;
    this.operadoraEditando = null;
    this.operadoraSelecionada = null;
  }

  editandoOperadora(): boolean {
    return this.estado === 'editandoOperadora';
  }

  adicionandoOperadora(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovaOperadora(): void {
    this.operadoraService.adicionarOperadora(this.operadoraEditando).subscribe(response => {
      this.snackBar.openSnackBar('Operadora adicionada com sucesso!');
      this.limpar();
      this.carregaTabelaOperadora();
    });
  }

  atualizarOperadora(): void {
    this.operadoraService.editarOperadora(this.operadoraEditando).subscribe(response => {
      this.snackBar.openSnackBar('Operadora atualizada com sucesso!');
      this.visualizar();
      this.carregaTabelaOperadora();
      this.operadoraSelecionada = response;
    });
  }

  removerOperadora(): void {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Tem certeza?',
        descricao: 'Deseja remover a operadora ' + this.operadoraSelecionada.nome + '?',
        confirma: 'Sim',
        cancela: 'Nao',
      }
    }).afterClosed().subscribe(confirmacao => {
      if (confirmacao) {
        this.operadoraService.excluirOperadora(this.operadoraSelecionada).subscribe(response => {
          this.snackBar.openSnackBar('Operadora apagada com sucesso!');
          this.limpar();
          this.carregaTabelaOperadora();
        });
      }
    });
  }
}
