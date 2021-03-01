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
import {Abrangencia} from '../../services/abrangencia/abrangencia';
import {AbrangenciaService} from '../../services/abrangencia/abrangencia.service';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.scss']
})
export class TabelaComponent implements OnInit {

  @ViewChild('sortTabela') sortTabela: MatSort;
  @ViewChild('paginatorTabela') paginatorTabela: MatPaginator;

  @ViewChild('sortLaboratorio') sortLaboratorio: MatSort;
  @ViewChild('paginatorLaboratorio') paginatorLaboratorio: MatPaginator;
  @ViewChild('sortLaboratorioEditando') sortLaboratorioEditando: MatSort;
  @ViewChild('paginatorLaboratorioEditando') paginatorLaboratorioEditando: MatPaginator;

  @ViewChild('sortHospital') sortHospital: MatSort;
  @ViewChild('paginatorHospital') paginatorHospital: MatPaginator;
  @ViewChild('sortHospitalEditando') sortHospitalEditando: MatSort;
  @ViewChild('paginatorHospitalEditando') paginatorHospitalEditando: MatPaginator;

  @ViewChild(MatAccordion) accordion: MatAccordion;

  displayedColumns: string[] = ['id', 'nome', 'abrangencia', 'operadora', 'reembolso'];
  dataSourceTabela = new MatTableDataSource<Tabela>();
  dataSourceHospital = new MatTableDataSource<Hospital>();
  dataSourceLaboratorio = new MatTableDataSource<Laboratorio>();

  estado: string;
  tabelaEditando: Tabela;
  tabelaSelecionada: Tabela;
  todosHospitais: Hospital[];
  todosEstados: Estado[];
  todosLaboratorios: Laboratorio[];
  todasAbrangencias: Abrangencia[];
  estadoAutoCompleteControl = new FormControl();
  estadoFilteredOptions: Observable<Estado[]>;

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private tabelaService: TabelaService,
    private estadoService: EstadoService,
    private hospitalService: HospitalService,
    private abrangenciaService: AbrangenciaService,
    private laboratorioService: LaboratorioService,
  ) {}

  ngOnInit(): void {
    this.estadoAutoCompleteControl.disable();
    this.estadoFilteredOptions = this.estadoAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.estadoFilterAutoComplete(value))
    );

    this.hospitalService.getAllHospitais().subscribe(response => this.todosHospitais = response);
    this.estadoService.getAllEstados().subscribe(response => this.todosEstados = response);
    this.laboratorioService.getAllLaboratorios().subscribe(response => this.todosLaboratorios = response);
    this.abrangenciaService.getAllAbrangencias().subscribe(response => console.log(response));
    this.carregaTabelaTabela();
  }

  operadoraComparator(operadora1: Operadora, operadora2: Operadora): boolean {
    return operadora1.id === operadora2.id;
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

  private carregaTabelaLaboratorio(laboratorios: Laboratorio[]): void {
    this.dataSourceLaboratorio = new MatTableDataSource<Laboratorio>(laboratorios);
    if (this.editandoTabela() || this.adicionandoTabela()) {
      this.dataSourceLaboratorio.sort = this.sortLaboratorioEditando;
      this.dataSourceLaboratorio.paginator = this.paginatorLaboratorioEditando;
    } else {
      this.dataSourceLaboratorio.sort = this.sortLaboratorio;
      this.dataSourceLaboratorio.paginator = this.paginatorLaboratorio;
    }
  }

  private carregaTabelaHospital(hospitais: Hospital[]): void {
    this.dataSourceHospital = new MatTableDataSource<Hospital>(hospitais);
    if (this.editandoTabela() || this.adicionandoTabela()) {
      this.dataSourceHospital.sort = this.sortHospitalEditando;
      this.dataSourceHospital.paginator = this.paginatorHospitalEditando;
    } else {
      this.dataSourceHospital.sort = this.sortHospital;
      this.dataSourceHospital.paginator = this.paginatorHospital;
    }
  }

  selecionaTabela(tabela: Tabela): void {
    this.estado = null;
    this.tabelaSelecionada = tabela;
    this.tabelaEditando = {...tabela};
    this.estadoAutoCompleteControl.disable();
    this.estadoAutoCompleteControl.setValue(this.tabelaEditando.operadora);
  }

  editarTabela(): void {
    this.estado = 'editandoTabela';
    this.estadoAutoCompleteControl.enable();
    this.preparaTodosParaNovaVerificacao();
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.tabelaEditando = {...this.tabelaSelecionada};
    this.estadoAutoCompleteControl.disable();
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.tabelaSelecionada = null;
    this.estadoAutoCompleteControl.disable();
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.tabelaSelecionada = new Tabela();
    this.estadoAutoCompleteControl.enable();
    this.estadoAutoCompleteControl.setValue(new Operadora());
    this.tabelaEditando = this.tabelaSelecionada;
    this.preparaTodosParaNovaVerificacao();
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
    this.preparaTodosParaNovaVerificacao();
  }

  editandoTabela(): boolean {
    return this.estado === 'editandoTabela';
  }

  adicionandoTabela(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovoTabela(): void {
    this.tabelaEditando.operadora = this.estadoAutoCompleteControl.value;
    this.tabelaService.adicionarTabela(this.tabelaEditando).subscribe(response => {
      this.snackBar.openSnackBar('Tabela adicionado com sucesso!');
      this.limpar();
      this.carregaTabelaTabela();
    });
  }

  private preparaTodosParaNovaVerificacao(): void {
    this.todosHospitais.forEach(p => p.selected = false);
    this.todosLaboratorios.forEach(p => p.selected = false);
  }

  atualizarTabela(): void {
    this.tabelaEditando.operadora = this.estadoAutoCompleteControl.value;
    this.tabelaService.editarTabela(this.tabelaEditando).subscribe(response => {
      this.snackBar.openSnackBar('Tabela atualizado com sucesso!');
      this.visualizar();
      this.carregaTabelaTabela();
      this.tabelaSelecionada = response;
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

  private estadoFilterAutoComplete(value: string): Estado[] {
    const filterValue = value?.toLowerCase();
    return this.todosEstados.filter(estado => estado.nome.toLowerCase().includes(filterValue));
  }

  estadoDisplayFn(estado: Estado): string {
    return estado && estado.nome ? estado.nome : '';
  }

}
