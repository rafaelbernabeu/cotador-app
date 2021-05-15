import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {FormControl, FormGroup} from "@angular/forms";
import {AuditoriaService} from "../../services/auditoria/auditoria.service";
import {UtilService} from "../../services/util/util.service";
import {AuditoriaAlteracao} from "../../services/auditoria/auditoria-alteracao";

@Component({
  selector: 'app-auditoria-alteracoes',
  templateUrl: './auditoria-alteracoes.component.html',
  styleUrls: ['./auditoria-alteracoes.component.scss']
})
export class AuditoriaAlteracoesComponent implements OnInit {

  @ViewChild(MatSort) sortAlteracao: MatSort;
  @ViewChild(MatPaginator) paginatorAlteracao: MatPaginator;

  displayedColumns: string[] = ["dataHora", "usuario", "tipoEntidade", "tipoAlteracao", "idEntidade"];
  dataSourceAlteracao = new MatTableDataSource<AuditoriaAlteracao>();

  dataAtual = new Date();
  datasSelecionadas = new FormGroup({
    dataInicio: new FormControl(new Date(this.dataAtual.getTime() - (60 * 60 * 24 * 30 * 1000))),
    dataFim: new FormControl(this.dataAtual)
  });

  constructor(
    private auditoriaService: AuditoriaService,
  ) { }

  ngOnInit(): void {
    this.carregaAlteracoes();
  }

  carregaAlteracoes() {
    if (this.datasSelecionadas.valid) {
      this.auditoriaService.getAllAlteracoes(this.datasSelecionadas.value).subscribe(response => {
        response.forEach(r => r.dataHora = UtilService.getDate(r.dataHora));
        this.dataSourceAlteracao = new MatTableDataSource<AuditoriaAlteracao>(response);
        this.dataSourceAlteracao.sort = this.sortAlteracao;
        this.dataSourceAlteracao.paginator = this.paginatorAlteracao;
      })
    }
  }

  downloadAlteracoes() {
    this.auditoriaService.downloadAlteracoesCSV(this.datasSelecionadas.value).subscribe(response => {
      let anchor = document.createElement("a");
      anchor.download = "auditoria-alteracoes.csv";
      anchor.href = window.URL.createObjectURL(response);;
      anchor.click();
    })
  }

  applyFilterAlteracoes(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAlteracao.filter = filterValue.trim().toLowerCase();
  }
}
