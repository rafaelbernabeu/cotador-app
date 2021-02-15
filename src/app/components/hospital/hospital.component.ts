import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Hospital} from '../../services/hospital/hospital';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {HospitalService} from '../../services/hospital/hospital.service';
import {DialogComponent} from '../dialog/dialog.component';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.scss']
})
export class HospitalComponent implements OnInit {

  @ViewChild(MatSort) sortHospital: MatSort;
  @ViewChild(MatPaginator) paginatorHospital: MatPaginator;

  displayedColumns: string[] = ['id', 'nome', 'local'];
  dataSourceHospital = new MatTableDataSource<Hospital>();

  estado: string;
  hospitalEditando: Hospital;
  hospitalSelecionado: Hospital;

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private hospitalService: HospitalService,
  ) {}

  ngOnInit(): void {
    this.carregaTabelaHospital();
  }

  private carregaTabelaHospital(): void {
    this.hospitalService.getAllHospitais().subscribe(response => {
        this.dataSourceHospital = new MatTableDataSource<Hospital>(response);
        this.dataSourceHospital.sort = this.sortHospital;
        this.dataSourceHospital.paginator = this.paginatorHospital;
      }
    );
  }

  selecionaHospital(hospital: Hospital): void {
    this.estado = null;
    this.hospitalSelecionado = hospital;
    this.hospitalEditando = {...hospital};
  }

  editarHospital(): void {
    const estadoAnterior = this.estado;
    this.estado = 'editandoHospital';
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.hospitalEditando = {...this.hospitalSelecionado};
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.hospitalSelecionado = null;
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.hospitalSelecionado = new Hospital();
    this.hospitalEditando = this.hospitalSelecionado;
  }

  visualizar(): void {
    this.estado = null;
  }

  limpar(): void {
    this.estado = null;
    this.hospitalEditando = null;
    this.hospitalSelecionado = null;
  }

  editandoHospital(): boolean {
    return this.estado === 'editandoHospital';
  }

  adicionandoHospital(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovoHospital(): void {
    this.hospitalService.adicionarHospital(this.hospitalEditando).subscribe(response => {
      this.snackBar.openSnackBar('Hospital adicionado com sucesso!');
      this.limpar();
      this.carregaTabelaHospital();
    });
  }

  atualizarHospital(): void {
    this.hospitalService.editarHospital(this.hospitalEditando).subscribe(response => {
      this.snackBar.openSnackBar('Hospital atualizado com sucesso!');
      this.visualizar();
      this.carregaTabelaHospital();
      this.hospitalSelecionado = response;
    });
  }

  removerHospital(): void {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Tem certeza?',
        descricao: 'Deseja remover o hopital ' + this.hospitalSelecionado.nome + '?',
        confirma: 'Sim',
        cancela: 'Nao',
      }
    }).afterClosed().subscribe(confirmacao => {
      if (confirmacao) {
        this.hospitalService.excluirHospital(this.hospitalSelecionado).subscribe(response => {
          this.snackBar.openSnackBar('Hospital apagado com sucesso!');
          this.limpar();
          this.carregaTabelaHospital();
        });
      }
    });
  }

}
