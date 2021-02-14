import {Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {EntidadeService} from '../../services/entidade/entidade.service';
import {Entidade} from '../../services/entidade/entidade';
import {MatPaginator} from '@angular/material/paginator';
import {Profissao} from '../../services/profissao/profissao';
import {ProfissaoService} from '../../services/profissao/profissao.service';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '../dialog/dialog.component';

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
  @ViewChild('profissoesSortEditando') sortProfissaoEditando: MatSort;
  @ViewChild('paginatorEditandoProfissoes') paginatorEditandoProfissao: MatPaginator;

  displayedColumns: string[] = ['id', 'nome'];
  dataSourceProfissao = new MatTableDataSource<Profissao>();
  dataSourceEntidade = new MatTableDataSource<Entidade>();

  estado: string;
  profissoes: Profissao[];
  entidadeEditando: Entidade;
  todasProfissoes: Profissao[];
  entidadeSelecionada: Entidade;

  constructor(
    private dialog: MatDialog,
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
    this.estado = null;
    this.entidadeSelecionada = entidade;
    this.entidadeEditando = {...entidade};
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
    this.entidadeEditando = {...this.entidadeSelecionada};
    this.configuraDataSource();
  }

  editarEntidade(): void {
    const estadoAnterior = this.estado;
    this.estado = 'editandoEntidade';
    if (estadoAnterior === 'editandoRelacionamento') {
      this.configuraDataSource();
    }
  }

  salvarProfissoes(): void {
    const profissoesSelecionadas = this.todasProfissoes.filter(p => p.selected);
    this.entidadeService.atualizarProfissoesDaEntidade(this.entidadeSelecionada, profissoesSelecionadas).subscribe(response => {
      this.snackBar.openSnackBar('Dados salvos com sucesso!');
      this.profissoes = response;
      this.visualizar();
      this.configuraDataSource();
    });
  }

  cancelarEdicaoRelacionamento(): void {
    this.cancelarEdicao();
    this.configuraDataSource();
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.entidadeEditando = {...this.entidadeSelecionada};
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.entidadeSelecionada = null;
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.profissoes = null;
    this.entidadeSelecionada = new Entidade();
    this.entidadeEditando = this.entidadeSelecionada;
  }

  visualizar(): void {
    this.estado = null;
  }

  limpar(): void {
    this.estado = null;
    this.profissoes = null;
    this.entidadeEditando = null;
    this.entidadeSelecionada = null;
  }

  private configuraDataSource(): void {
    if (this.estado === 'editandoRelacionamento') {
      this.dataSourceProfissao = new MatTableDataSource<Profissao>(this.todasProfissoes);
      this.dataSourceProfissao.sort = this.sortProfissaoEditando;
      this.dataSourceProfissao.paginator = this.paginatorEditandoProfissao;
    } else {
      this.dataSourceProfissao = new MatTableDataSource<Profissao>(this.profissoes);
      this.dataSourceProfissao.sort = this.sortProfissao;
      this.dataSourceProfissao.paginator = this.paginatorProfissao;
    }
  }

  private preparaParaNovaVerificacao(): void {
    this.todasProfissoes.forEach(p => p.selected = false);
  }

  editandoRelacionamento(): boolean {
    return this.estado === 'editandoRelacionamento';
    this.configuraDataSource();
  }

  editandoEntidade(): boolean {
    return this.estado === 'editandoEntidade';
  }

  adicionandoEntidade(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovaEntidade(): void {
    this.entidadeService.adicionarEntidade(this.entidadeEditando).subscribe(response => {
      this.snackBar.openSnackBar('Entidade adicionada com sucesso!');
      this.limpar();
      this.carregaTabelaEntidades();
    });
  }

  atualizarEntidade(): void {
    this.entidadeService.editarEntidade(this.entidadeEditando).subscribe(response => {
      this.snackBar.openSnackBar('Entidade atualizada com sucesso!');
      this.visualizar();
      this.carregaTabelaEntidades();
      this.entidadeSelecionada = response;
    });
  }

  removerEntidade(): void {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Tem certeza?',
        descricao: 'Deseja remover a entidade ' + this.entidadeSelecionada.nome + '?',
        confirma: 'Sim',
        cancela: 'Nao',
      }
    }).afterClosed().subscribe(confirmacao => {
      if (confirmacao) {
        this.entidadeService.excluirEntidade(this.entidadeSelecionada).subscribe(response => {
          this.snackBar.openSnackBar('Entidade apagada com sucesso!');
          this.limpar();
          this.carregaTabelaEntidades();
        });
      }
    });
  }
}
