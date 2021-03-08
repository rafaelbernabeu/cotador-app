import {Component, OnInit, ViewChild} from '@angular/core';
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
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-laboratorio',
  templateUrl: './laboratorio.component.html',
  styleUrls: ['./laboratorio.component.scss']
})
export class LaboratorioComponent implements OnInit {

  @ViewChild(MatSort) sortLaboratorio: MatSort;
  @ViewChild(MatPaginator) paginatorLaboratorio: MatPaginator;

  displayedColumns: string[] = ['id', 'nome', 'estado'];
  dataSourceLaboratorio = new MatTableDataSource<Laboratorio>();

  estado: string;
  todosEstados: Estado[];
  laboratorioEditando: Laboratorio;
  laboratorioSelecionado: Laboratorio;

  estadoFilteredOptions: Observable<Estado[]>;
  estadoAutoCompleteControl = new FormControl();

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private estadoService: EstadoService,
    private laboratorioService: LaboratorioService,
  ) {}

  ngOnInit(): void {
    this.estadoService.getAllEstados().subscribe(response => this.todosEstados = response);
    this.carregaTabelaLaboratorio();
    this.iniciaAutoComplete();
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
    this.estadoAutoCompleteControl.disable();
    this.estadoAutoCompleteControl.setValue(this.laboratorioEditando.estado);
  }

  editarLaboratorio(): void {
    this.estado = 'editandoLaboratorio';
    this.estadoAutoCompleteControl.enable();
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.laboratorioEditando = {...this.laboratorioSelecionado};
    this.estadoAutoCompleteControl.disable();
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.laboratorioSelecionado = null;
    this.estadoAutoCompleteControl.disable();
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.laboratorioSelecionado = new Laboratorio();
    this.laboratorioEditando = this.laboratorioSelecionado;
    this.estadoAutoCompleteControl.enable();
    this.estadoAutoCompleteControl.setValue('');
  }

  visualizar(): void {
    this.estado = null;
    this.estadoAutoCompleteControl.disable();
  }

  limpar(): void {
    this.estado = null;
    this.laboratorioEditando = null;
    this.laboratorioSelecionado = null;
    this.estadoAutoCompleteControl.disable();
  }

  editandoLaboratorio(): boolean {
    return this.estado === 'editandoLaboratorio';
  }

  adicionandoLaboratorio(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovoLaboratorio(): void {
    this.laboratorioEditando.estado = this.estadoAutoCompleteControl.value;
    this.laboratorioService.adicionarLaboratorio(this.laboratorioEditando).subscribe(response => {
      this.snackBar.openSnackBar('Laboratorio adicionado com sucesso!');
      this.limpar();
      this.carregaTabelaLaboratorio();
    });
  }

  atualizarLaboratorio(): void {
    this.laboratorioEditando.estado = this.estadoAutoCompleteControl.value;
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

  estadoDisplayFn(estado: Estado): string {
    return estado && estado.nome ? estado.nome : '';
  }

  private iniciaAutoComplete(): void {
    this.estadoFilteredOptions = this.estadoAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.estadoFilterAutoComplete(value))
    );
  }

  private estadoFilterAutoComplete(value: string): Estado[] {
    const filterValue = value?.toLowerCase();
    return this.todosEstados.filter(estado => estado.nome.toLowerCase().includes(filterValue) || estado.sigla.toLowerCase().includes(filterValue));
  }
}
