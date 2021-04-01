import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {AuditoriaLogin} from "../../services/auditoria/auditoria-login";
import {AuditoriaService} from "../../services/auditoria/auditoria.service";
import {UtilService} from "../../services/util/util.service";

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

  constructor(
    private utilService: UtilService,
    private auditoriaService: AuditoriaService,
  ) { }

  ngOnInit(): void {
    this.auditoriaService.getAllLogins().subscribe(response => {
      this.dataSourceLogin = new MatTableDataSource<AuditoriaLogin>(response);
      this.dataSourceLogin.sort = this.sortLogin;
      this.dataSourceLogin.paginator = this.paginatorLogin;
      this.dataSourceLogin.sortingDataAccessor = (login, property) => {
        switch (property) {
          case 'dataHora':
            return this.utilService.getDate(login.dataHora).getTime();
          default:
            return login[property];
        }
      }
    })
  }

}
