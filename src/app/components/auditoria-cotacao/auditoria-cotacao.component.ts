import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {AuditoriaLogin} from "../../services/auditoria/auditoria-login";
import {FormControl, FormGroup} from "@angular/forms";
import {AuditoriaService} from "../../services/auditoria/auditoria.service";
import {UtilService} from "../../services/util/util.service";
import {AuditoriaCotacao} from "../../services/auditoria/auditoria-cotacao";

@Component({
  selector: 'app-auditoria-cotacao',
  templateUrl: './auditoria-cotacao.component.html',
  styleUrls: ['./auditoria-cotacao.component.scss']
})
export class AuditoriaCotacaoComponent implements OnInit {

  @ViewChild(MatSort) sortLogin: MatSort;
  @ViewChild(MatPaginator) paginatorLogin: MatPaginator;

  displayedColumns: string[] = ["dataHora", "usuario", "link"];
  dataSourceCotacao = new MatTableDataSource<AuditoriaCotacao>();

  dataAtual = new Date();
  datasSelecionadas = new FormGroup({
    dataInicio: new FormControl(new Date(this.dataAtual.getTime() - (60 * 60 * 24 * 30 * 1000))),
    dataFim: new FormControl(this.dataAtual)
  });

  constructor(
    private auditoriaService: AuditoriaService,
  ) { }

  ngOnInit(): void {
    this.carregaCotacoes();
  }

  carregaCotacoes() {
    if (this.datasSelecionadas.valid) {
      this.auditoriaService.getAllCotacoes(this.datasSelecionadas.value).subscribe(response => {
        this.dataSourceCotacao = new MatTableDataSource<AuditoriaCotacao>(response);
        this.dataSourceCotacao.sort = this.sortLogin;
        this.dataSourceCotacao.paginator = this.paginatorLogin;
        this.dataSourceCotacao.sortingDataAccessor = (login, property) => {
          switch (property) {
            case 'dataHora':
              return login[property];
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
