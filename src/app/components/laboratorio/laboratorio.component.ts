import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Laboratorio} from '../../services/laboratorio/laboratorio';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {LaboratorioService} from '../../services/laboratorio/laboratorio.service';
import {DialogComponent} from '../dialog/dialog.component';

@Component({
  selector: 'app-laboratorio',
  templateUrl: './laboratorio.component.html',
  styleUrls: ['./laboratorio.component.scss']
})
export class LaboratorioComponent implements OnInit {

  @ViewChild(MatSort) sortLaboratorio: MatSort;
  @ViewChild(MatPaginator) paginatorLaboratorio: MatPaginator;

  displayedColumns: string[] = ['id', 'nome', 'local'];
  dataSourceLaboratorio = new MatTableDataSource<Laboratorio>();

  estado: string;
  laboratorioEditando: Laboratorio;
  laboratorioSelecionado: Laboratorio;

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private laboratorioService: LaboratorioService,
  ) {}

  ngOnInit(): void {
    this.carregaTabelaLaboratorio();
  }

  private carregaTabelaLaboratorio(): void {
    this.laboratorioService.getAllLaboratorios().subscribe(response => {
        this.dataSourceLaboratorio = new MatTableDataSource<Laboratorio>(response);
        this.dataSourceLaboratorio.sort = this.sortLaboratorio;
        this.dataSourceLaboratorio.paginator = this.paginatorLaboratorio;
      }
    );
  }

  selecionaLaboratorio(laboratorio: Laboratorio): void {
    this.estado = null;
    this.laboratorioSelecionado = laboratorio;
    this.laboratorioEditando = {...laboratorio};
  }

  editarLaboratorio(): void {
    const estadoAnterior = this.estado;
    this.estado = 'editandoLaboratorio';
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.laboratorioEditando = {...this.laboratorioSelecionado};
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.laboratorioSelecionado = null;
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.laboratorioSelecionado = new Laboratorio();
    this.laboratorioEditando = this.laboratorioSelecionado;
  }

  visualizar(): void {
    this.estado = null;
  }

  limpar(): void {
    this.estado = null;
    this.laboratorioEditando = null;
    this.laboratorioSelecionado = null;
  }

  editandoLaboratorio(): boolean {
    return this.estado === 'editandoLaboratorio';
  }

  adicionandoLaboratorio(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovoLaboratorio(): void {
    this.laboratorioService.adicionarLaboratorio(this.laboratorioEditando).subscribe(response => {
      this.snackBar.openSnackBar('Laboratorio adicionado com sucesso!');
      this.limpar();
      this.carregaTabelaLaboratorio();
    });
  }

  atualizarLaboratorio(): void {
    this.laboratorioService.editarLaboratorio(this.laboratorioEditando).subscribe(response => {
      this.snackBar.openSnackBar('Laboratorio atualizado com sucesso!');
      this.visualizar();
      this.carregaTabelaLaboratorio();
      this.laboratorioSelecionado = response;
    });
  }

  removerLaboratorio(): void {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Tem certeza?',
        descricao: 'Deseja remover o hopital ' + this.laboratorioSelecionado.nome + '?',
        confirma: 'Sim',
        cancela: 'Nao',
      }
    }).afterClosed().subscribe(confirmacao => {
      if (confirmacao) {
        this.laboratorioService.excluirLaboratorio(this.laboratorioSelecionado).subscribe(response => {
          this.snackBar.openSnackBar('Laboratorio apagado com sucesso!');
          this.limpar();
          this.carregaTabelaLaboratorio();
        });
      }
    });
  }
}
