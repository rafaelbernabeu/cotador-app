import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
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

  @ViewChild('entidadesSort') sortEntidade: MatSort;
  @ViewChild('profissoesSort') sortProfissao: MatSort;
  @ViewChild('paginatorEntidades') paginatorEntidade: MatPaginator;
  @ViewChild('paginatorProfissoes') paginatorProfissao: MatPaginator;

  displayedColumns: string[] = ['id', 'nome'];
  dataSourceProfissao = new MatTableDataSource<Profissao>();
  dataSourceEntidade = new MatTableDataSource<Entidade>();

  editando = false;
  profissoes: Profissao[];
  todasProfissoes: Profissao[];

  constructor(
    private entidadeService: EntidadeService,
    private profissaoService: ProfissaoService,
  ) {}

  ngOnInit(): void {
    this.entidadeService.getAllEntidades().subscribe(response => {
        this.dataSourceEntidade = new MatTableDataSource<Entidade>(response);
        this.dataSourceEntidade.sort = this.sortEntidade;
        this.dataSourceEntidade.paginator = this.paginatorEntidade;
      }
    );

    this.profissaoService.getAllProfissoes().subscribe(response => {
      this.todasProfissoes = response;
    });
  }

  selectEntidade(id: number): void {
    this.preparaParaNovaVerificacao();

    this.entidadeService.getProfissoesByEntidadeId(id).subscribe(response => {
      this.profissoes = response;

      this.todasProfissoes.forEach(todas => {
        this.profissoes.forEach(profissao => {
          if (todas.id === profissao.id) {
            todas.selected = true;
          }
        });
      });
      this.configuraDataSource();
    });

  }

  editar(): void {
    this.editando = !this.editando;
    this.configuraDataSource();
  }

  private configuraDataSource(): void {
    if (this.editando) {
      this.dataSourceProfissao = new MatTableDataSource<Profissao>(this.todasProfissoes);
    } else {
      this.dataSourceProfissao = new MatTableDataSource<Profissao>(this.profissoes);
    }
    this.dataSourceProfissao.sort = this.sortProfissao;
    this.dataSourceProfissao.paginator = this.paginatorProfissao;
  }

  private preparaParaNovaVerificacao(): void {
    this.todasProfissoes.forEach(p => p.selected = false);
  }

}
