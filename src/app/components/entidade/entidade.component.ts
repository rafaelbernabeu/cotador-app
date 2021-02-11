import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Usuario} from '../../services/usuario/usuario';
import {EntidadeService} from '../../services/entidade/entidade.service';
import {Entidade} from '../../services/entidade/entidade';
import {MatPaginator} from '@angular/material/paginator';
import {Profissao} from '../../services/profissao/profissao';
import {ProfissaoService} from '../../services/profissao/profissao.service';

@Component({
  selector: 'app-entidade',
  templateUrl: './entidade.component.html',
  styleUrls: ['./entidade.component.scss']
})
export class EntidadeComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['id', 'nome'];
  dataSource = new MatTableDataSource<Entidade>();

  editar = false;
  profissoes: Profissao[];
  todasProfissoes: Profissao[];

  constructor(
    private entidadeService: EntidadeService,
    private profissaoService: ProfissaoService,
  ) {}

  ngOnInit(): void {
    this.entidadeService.getAllEntidades().subscribe(response => {
        this.dataSource = new MatTableDataSource<Entidade>(response);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    );

    this.profissaoService.getAllProfissoes().subscribe(response => {
      this.todasProfissoes = response;
    });
  }

  selectEntidade(id: number): void {
    this.entidadeService.getProfissoesByEntidadeId(id).subscribe(response => {
      this.profissoes = response;
    });
  }


}
