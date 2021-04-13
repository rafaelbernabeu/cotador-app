import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Laboratorio} from '../../services/laboratorio/laboratorio';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {LaboratorioService} from '../../services/laboratorio/laboratorio.service';
import {DialogComponent} from '../dialog/dialog.component';
import {EstadoService} from "../../services/estado/estado.service";
import {Estado} from "../../services/estado/estado";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-laboratorio',
  templateUrl: './laboratorio.component.html',
  styleUrls: ['./laboratorio.component.scss']
})
export class LaboratorioComponent implements OnInit {

  @ViewChild(NgForm) formLaboratorio: NgForm;
  @ViewChild(MatSort) sortLaboratorio: MatSort;
  @ViewChild(MatPaginator) paginatorLaboratorio: MatPaginator;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((this.adicionandoLaboratorio() || this.editandoLaboratorio()) && event.ctrlKey && event.code === 'Enter') {
      event.preventDefault();
      this.onSubmit();
    }
  }

  displayedColumns: string[] = ['id', 'nome', 'local'];
  dataSourceLaboratorio = new MatTableDataSource<Laboratorio>();

  estado: string;
  todosEstados: Estado[];
  laboratorioEditando: Laboratorio;
  laboratorioSelecionado: Laboratorio;

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private estadoService: EstadoService,
    private laboratorioService: LaboratorioService,
  ) {}

  ngOnInit(): void {
    this.estadoService.getAllEstados().subscribe(response => this.todosEstados = response);
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
    this.editarLaboratorio();
  }

  editarLaboratorio(): void {
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
    this.formLaboratorio?.resetForm();
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
    if (this.formLaboratorio.valid) {
      this.laboratorioService.adicionarLaboratorio(this.laboratorioEditando).subscribe(response => {
        this.snackBar.openSnackBar('Laboratorio adicionado com sucesso!');
        this.limpar();
        this.carregaTabelaLaboratorio();
      });
    } else {
      this.erroFormInvalido();
    }
  }

  atualizarLaboratorio(): void {
    if (this.formLaboratorio.valid) {
      this.laboratorioService.editarLaboratorio(this.laboratorioEditando).subscribe(response => {
        this.snackBar.openSnackBar('Laboratorio atualizado com sucesso!');
        this.visualizar();
        this.carregaTabelaLaboratorio();
        this.laboratorioSelecionado = response;
      });
    } else {
      this.erroFormInvalido();
    }
  }

  private erroFormInvalido(): void {
    this.formLaboratorio.form.markAllAsTouched();
    this.snackBar.openSnackBar("Preencha todos os campos!");
  }

  removerLaboratorio(): void {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Tem certeza?',
        descricao: 'Deseja remover o laboratorio ' + this.laboratorioSelecionado.nome + '?',
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

  onSubmit(): void {
    if (this.adicionandoLaboratorio()) {
      this.salvarNovoLaboratorio();
    } else if (this.editandoLaboratorio()) {
      this.atualizarLaboratorio();
    }
  }

}
