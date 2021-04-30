import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
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
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-entidade',
  templateUrl: './entidade.component.html',
  styleUrls: ['./entidade.component.scss']
})
export class EntidadeComponent implements OnInit {

  @ViewChild('formEntidade') formEntidade: NgForm;
  @ViewChild('entidadesSort') sortEntidade: MatSort;
  @ViewChild('profissoesSort') sortProfissao: MatSort;
  @ViewChild('paginatorEntidades') paginatorEntidade: MatPaginator;
  @ViewChild('paginatorProfissoes') paginatorProfissao: MatPaginator;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((this.adicionandoEntidade() || this.editandoEntidade()) && event.ctrlKey && event.code === 'Enter') {
      event.preventDefault();
      this.onSubmit();
    }
  }

  displayedColumns: string[] = ['id', 'nome', 'profissoes', 'valorAssociacao', 'documentacao', 'observacoes'];
  dataSourceProfissao = new MatTableDataSource<Profissao>();
  dataSourceEntidade = new MatTableDataSource<Entidade>();

  estado: string;
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
    this.carregaTabelaEntidade();

    this.profissaoService.getAllProfissoes().subscribe(response => {
      this.todasProfissoes = response;
    });
  }

  private carregaTabelaEntidade(): void {
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
    this.carregaTabelaProfissao(this.entidadeSelecionada.profissoes);
  }

  editarEntidade(): void {
    this.estado = 'editandoEntidade';
    this.preparaProfissoesParaNovaVerificacao();
    this.todasProfissoes.forEach(todas => {
      this.entidadeSelecionada.profissoes.forEach(profissao => {
        if (todas.id === profissao.id) {
          todas.selected = true;
        }
      });
    });
    this.carregaTabelaProfissao(this.todasProfissoes);
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.entidadeEditando = {...this.entidadeSelecionada};
    this.carregaTabelaProfissao(this.entidadeSelecionada.profissoes);
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.entidadeSelecionada = null;
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.formEntidade?.resetForm();
    this.entidadeSelecionada = new Entidade();
    this.entidadeEditando = this.entidadeSelecionada;
    this.preparaProfissoesParaNovaVerificacao();
    this.carregaTabelaProfissao(this.todasProfissoes);
  }

  visualizar(): void {
    this.estado = null;
  }

  limpar(): void {
    this.estado = null;
    this.entidadeEditando = null;
    this.entidadeSelecionada = null;
  }

  private carregaTabelaProfissao(profissoes: Profissao[]): void {
    this.dataSourceProfissao = new MatTableDataSource<Profissao>(profissoes);
    this.dataSourceProfissao.sort = this.sortProfissao;
    this.dataSourceProfissao.paginator = this.paginatorProfissao;
  }

  private readonly columnsProfissao = ['id', 'nome'];
  getColumnsProfissao(): string[] {
    if (this.adicionandoEntidade() || this.editandoEntidade()) {
      return this.columnsProfissao.concat('selected');
    }
    return this.columnsProfissao;
  }

  private preparaProfissoesParaNovaVerificacao(): void {
    this.todasProfissoes.forEach(p => p.selected = false);
  }

  editandoEntidade(): boolean {
    return this.estado === 'editandoEntidade';
  }

  adicionandoEntidade(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovaEntidade(): void {
    if (this.formEntidade.valid) {
      this.entidadeEditando.profissoes = this.todasProfissoes.filter(p => p.selected);
      this.entidadeService.adicionarEntidade(this.entidadeEditando).subscribe(response => {
        this.snackBar.openSnackBar('Entidade adicionada com sucesso!');
        this.limpar();
        this.carregaTabelaEntidade();
      });
    } else {
      this.erroFormInvalido();
    }
  }

  atualizarEntidade(): void {
    if (this.formEntidade.valid) {
      this.entidadeEditando.profissoes = this.todasProfissoes.filter(p => p.selected);
      this.entidadeService.editarEntidade(this.entidadeEditando).subscribe(response => {
        this.snackBar.openSnackBar('Entidade atualizada com sucesso!');
        this.visualizar();
        this.carregaTabelaEntidade();
        this.entidadeSelecionada = response;
        this.carregaTabelaProfissao(this.entidadeSelecionada.profissoes);
      });
    } else {
      this.erroFormInvalido();
    }
  }

  private erroFormInvalido(): void {
    this.formEntidade.form.markAllAsTouched();
    this.snackBar.openSnackBar("Preencha todos os campos!");
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
          this.carregaTabelaEntidade();
        });
      }
    });
  }

  onSubmit(): void {
    if (this.adicionandoEntidade()) {
      this.salvarNovaEntidade();
    } else if (this.editandoEntidade()) {
      this.atualizarEntidade();
    }
  }

  getNomeProfissao(profissao: Profissao): string {
    return profissao.nome;
  }
}
