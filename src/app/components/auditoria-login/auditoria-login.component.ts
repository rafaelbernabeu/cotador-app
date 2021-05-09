import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {AuditoriaLogin} from "../../services/auditoria/auditoria-login";
import {AuditoriaService} from "../../services/auditoria/auditoria.service";
import {UtilService} from "../../services/util/util.service";
import {FormControl, FormGroup} from "@angular/forms";
import {map, tap} from "rxjs/operators";

@Component({
  selector: 'app-auditoria-login',
  templateUrl: './auditoria-login.component.html',
  styleUrls: ['./auditoria-login.component.scss']
})
export class AuditoriaLoginComponent implements OnInit {

  @ViewChild(MatSort) sortLogin: MatSort;
  @ViewChild(MatPaginator) paginatorLogin: MatPaginator;

  displayedColumns: string[] = ["dataHora", "usuario", "ip", "latitude", "userAgent"];
  dataSourceLogin = new MatTableDataSource<AuditoriaLogin>();

  dataAtual = new Date();
  datasSelecionadas = new FormGroup({
    dataInicio: new FormControl(new Date(this.dataAtual.getTime() - (60 * 60 * 24 * 30 * 1000))),
    dataFim: new FormControl(this.dataAtual)
  });

  constructor(
    private auditoriaService: AuditoriaService,
  ) { }

  ngOnInit(): void {
    this.carregaLogins();
  }

  carregaLogins() {
    if (this.datasSelecionadas.valid) {
      this.auditoriaService.getAllLogins(this.datasSelecionadas.value).subscribe(response => {
        this.dataSourceLogin = new MatTableDataSource<AuditoriaLogin>(response);
        this.dataSourceLogin.sort = this.sortLogin;
        this.dataSourceLogin.paginator = this.paginatorLogin;
        this.dataSourceLogin.sortingDataAccessor = (login, property) => {
          switch (property) {
            case 'dataHora':
              return this.getDate(login.dataHora).getTime();
            default:
              return login[property];
          }
        }
      })
    }
  }

  getDate(dataHora: any) {
    return UtilService.getDate(dataHora);
  }

}
