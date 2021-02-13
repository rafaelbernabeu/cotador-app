import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {EntidadeService} from '../../services/entidade/entidade.service';
import {Entidade} from '../../services/entidade/entidade';
import {MatPaginator} from '@angular/material/paginator';
import {Profissao} from '../../services/profissao/profissao';
import {ProfissaoService} from '../../services/profissao/profissao.service';
import {SnackbarService} from '../../services/snackbar/snackbar.service';

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

  estado: string;
  profissoes: Profissao[];
  todasProfissoes: Profissao[];
  entidadeSelecionada: Entidade;

  constructor(
    private snackBar: SnackbarService,
    private entidadeService: EntidadeService,
    private profissaoService: ProfissaoService,
  ) {}

  ngOnInit(): void {
    this.carregaTabelaEntidades();

    this.profissaoService.getAllProfissoes().subscribe(response => {
      this.todasProfissoes = response;
    });
  }

  private carregaTabelaEntidades(): void {
    this.entidadeService.getAllEntidades().subscribe(response => {
        this.dataSourceEntidade = new MatTableDataSource<Entidade>(response);
        this.dataSourceEntidade.sort = this.sortEntidade;
        this.dataSourceEntidade.paginator = this.paginatorEntidade;
      }
    );
  }

  selecionaEntidade(entidade: Entidade): void {
    this.entidadeSelecionada = entidade;
    this.preparaParaNovaVerificacao();

    this.entidadeService.getProfissoesByEntidade(entidade).subscribe(response => {
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

  editarRelacionamento(): void {
    this.estado = 'editandoRelacionamento';
    this.configuraDataSource();
  }

  editarEntidade(): void {
    this.estado = 'editandoEntidade';
  }

  salvarProfissoes(): void {
    const profissoesSelecionadas = this.todasProfissoes.filter(p => p.selected);
    console.log(profissoesSelecionadas);
    this.entidadeService.atualizarProfissoesDaEntidade(this.entidadeSelecionada, profissoesSelecionadas).subscribe(response => {
      this.snackBar.openSnackBar('Dados salvos com sucesso!');
      this.carregaTabelaEntidades();
      this.limpar();
    });
  }

  cancelar(): void {
    this.limpar();
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.entidadeSelecionada = new Entidade();
  }

  limpar(): void {
    this.estado = null;
    this.profissoes = null;
    this.entidadeSelecionada = null;
  }

  private configuraDataSource(): void {
    if (this.estado === 'editandoRelacionamento') {
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

  editandoRelacionamento(): boolean {
    return this.estado === 'editandoRelacionamento';
  }

  editandoEntidade(): boolean {
    return this.estado === 'editandoEntidade';
  }

  adicionandoEntidade(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovaEntidade(): void {
    this.entidadeService.adicionarEntidade(this.entidadeSelecionada).subscribe(response => {
      this.snackBar.openSnackBar('Entidade adicionada com sucesso!');
      this.limpar();
      this.carregaTabelaEntidades();
    });
  }

  salvarEntidadeEditada(): void {
    this.entidadeService.editarEntidade(this.entidadeSelecionada).subscribe(response => {
      this.snackBar.openSnackBar('Entidade atualizada com sucesso!');
      this.limpar();
      this.carregaTabelaEntidades();
    });
  }
}
