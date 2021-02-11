import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Entidade} from '../../services/entidade/entidade';
import {EntidadeService} from '../../services/entidade/entidade.service';
import {ProfissaoService} from '../../services/profissao/profissao.service';
import {Profissao} from '../../services/profissao/profissao';

@Component({
  selector: 'app-profissao',
  templateUrl: './profissao.component.html',
  styleUrls: ['./profissao.component.scss']
})
export class ProfissaoComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['id', 'nome'];
  dataSource = new MatTableDataSource<Profissao>();

  constructor(
    private profissaoService: ProfissaoService
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Profissao>()
  }

}
