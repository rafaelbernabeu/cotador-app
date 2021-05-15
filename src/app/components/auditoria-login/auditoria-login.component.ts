import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {AuditoriaLogin} from "../../services/auditoria/auditoria-login";
import {AuditoriaService} from "../../services/auditoria/auditoria.service";
import {UtilService} from "../../services/util/util.service";
import {FormControl, FormGroup} from "@angular/forms";

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
    private auditoriaService: AuditoriaService
  ) { }

  ngOnInit(): void {
    this.carregaLogins();
  }

  carregaLogins() {
    if (this.datasSelecionadas.valid) {
      this.auditoriaService.getAllLogins(this.datasSelecionadas.value).subscribe(response => {
        response.forEach(r => r.dataHora = UtilService.getDate(r.dataHora));
        this.dataSourceLogin = new MatTableDataSource<AuditoriaLogin>(response);
        this.dataSourceLogin.sort = this.sortLogin;
        this.dataSourceLogin.paginator = this.paginatorLogin;
      })
    }
  }

  downloadLogins() {
    this.auditoriaService.downloadLoginsCSV(this.datasSelecionadas.value).subscribe(response => {
      let anchor = document.createElement("a");
      anchor.download = "auditoria-logins.csv";
      anchor.href = window.URL.createObjectURL(response);;
      anchor.click();
    })
  }

  applyFilterLogin(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceLogin.filter = filterValue.trim().toLowerCase();
  }
}
