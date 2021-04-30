import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {OperadoraService} from '../../services/operadora/operadora.service';
import {DialogComponent} from '../dialog/dialog.component';
import {Operadora} from '../../services/operadora/operadora';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-operadora',
  templateUrl: './operadora.component.html',
  styleUrls: ['./operadora.component.scss']
})
export class OperadoraComponent implements OnInit {

  @ViewChild(NgForm) formOperadora: NgForm;
  @ViewChild(MatSort) sortOperadora: MatSort;
  @ViewChild(MatPaginator) paginatorOperadora: MatPaginator;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if ((this.adicionandoOperadora() || this.editandoOperadora()) && event.code === 'Enter') {
        event.preventDefault();
        this.onSubmit();
      } else if (event.code === 'KeyA') {
        event.preventDefault();
        this.adicionar();
      } else if (this.operadoraSelecionada && event.code === 'KeyE') {
        event.preventDefault();
        this.editarOperadora();
      }
    } else if (event.code === 'Escape') {
      if (this.editandoOperadora()) {
        event.preventDefault();
        this.cancelarEdicao();
      } else {
        event.preventDefault();
        this.cancelarAdicao();
      }
    }
  }

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
    this.editarOperadora();
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
    this.formOperadora?.resetForm();
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
    if (this.formOperadora.valid) {
      this.operadoraService.adicionarOperadora(this.operadoraEditando).subscribe(response => {
        this.snackBar.openSnackBar('Operadora adicionada com sucesso!');
        this.limpar();
        this.carregaTabelaOperadora();
      });
    } else {
      this.erroFormInvalido();
    }
  }

  atualizarOperadora(): void {
    if (this.formOperadora.valid) {
      this.operadoraService.editarOperadora(this.operadoraEditando).subscribe(response => {
        this.snackBar.openSnackBar('Operadora atualizada com sucesso!');
        this.visualizar();
        this.carregaTabelaOperadora();
        this.operadoraSelecionada = response;
      });
    } else {
      this.erroFormInvalido();
    }
  }

  private erroFormInvalido(): void {
    this.formOperadora.form.markAllAsTouched();
    this.snackBar.openSnackBar("Preencha todos os campos!");
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

  onSubmit(): void {
    if (this.adicionandoOperadora()) {
      this.salvarNovaOperadora();
    } else if (this.editandoOperadora()) {
      this.atualizarOperadora();
    }
  }

}
