import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {DialogComponent} from '../dialog/dialog.component';
import {Administradora} from '../../services/administradora/administradora';
import {AdministradoraService} from '../../services/administradora/administradora.service';

@Component({
  selector: 'app-administradora',
  templateUrl: './administradora.component.html',
  styleUrls: ['./administradora.component.scss']
})
export class AdministradoraComponent implements OnInit {

  @ViewChild(MatSort) sortAdministradora: MatSort;
  @ViewChild(MatPaginator) paginatorAdministradora: MatPaginator;

  displayedColumns: string[] = ['id', 'nome'];
  dataSourceAdministradora = new MatTableDataSource<Administradora>();

  estado: string;
  AdministradoraEditando: Administradora;
  administradoraSelecionada: Administradora;

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private administradoraService: AdministradoraService,
  ) {}

  ngOnInit(): void {
    this.carregaTabelaAdministradora();
  }

  private carregaTabelaAdministradora(): void {
    this.administradoraService.getAllAdministradoras().subscribe(response => {
        this.dataSourceAdministradora = new MatTableDataSource<Administradora>(response);
        this.dataSourceAdministradora.sort = this.sortAdministradora;
        this.dataSourceAdministradora.paginator = this.paginatorAdministradora;
      }
    );
  }

  selecionaAdministradora(administradora: Administradora): void {
    this.estado = null;
    this.administradoraSelecionada = administradora;
    this.AdministradoraEditando = {...administradora};
  }

  editarAdministradora(): void {
    this.estado = 'editandoAdministradora';
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.AdministradoraEditando = {...this.administradoraSelecionada};
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.administradoraSelecionada = null;
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.administradoraSelecionada = new Administradora();
    this.AdministradoraEditando = this.administradoraSelecionada;
  }

  visualizar(): void {
    this.estado = null;
  }

  limpar(): void {
    this.estado = null;
    this.AdministradoraEditando = null;
    this.administradoraSelecionada = null;
  }

  editandoAdministradora(): boolean {
    return this.estado === 'editandoAdministradora';
  }

  adicionandoAdministradora(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovaAdministradora(): void {
    this.administradoraService.adicionarAdministradora(this.AdministradoraEditando).subscribe(response => {
      this.snackBar.openSnackBar('Administradora adicionada com sucesso!');
      this.limpar();
      this.carregaTabelaAdministradora();
    });
  }

  atualizarAdministradora(): void {
    this.administradoraService.editarAdministradora(this.AdministradoraEditando).subscribe(response => {
      this.snackBar.openSnackBar('Administradora atualizada com sucesso!');
      this.visualizar();
      this.carregaTabelaAdministradora();
      this.administradoraSelecionada = response;
    });
  }

  removerAdministradora(): void {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Tem certeza?',
        descricao: 'Deseja remover a administradora ' + this.administradoraSelecionada.nome + '?',
        confirma: 'Sim',
        cancela: 'Nao',
      }
    }).afterClosed().subscribe(confirmacao => {
      if (confirmacao) {
        this.administradoraService.excluirAdministradora(this.administradoraSelecionada).subscribe(response => {
          this.snackBar.openSnackBar('Administradora apagada com sucesso!');
          this.limpar();
          this.carregaTabelaAdministradora();
        });
      }
    });
  }

}
