import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Profissao} from '../../services/profissao/profissao';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {ProfissaoService} from '../../services/profissao/profissao.service';
import {DialogComponent} from '../dialog/dialog.component';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-profissao',
  templateUrl: './profissao.component.html',
  styleUrls: ['./profissao.component.scss']
})
export class ProfissaoComponent implements OnInit {

  @ViewChild(NgForm) formProfissao: NgForm;
  @ViewChild(MatSort) sortProfissao: MatSort;
  @ViewChild(MatPaginator) paginatorProfissao: MatPaginator;

  displayedColumns: string[] = ['id', 'nome'];
  dataSourceProfissao = new MatTableDataSource<Profissao>();

  estado: string;
  profissaoEditando: Profissao;
  profissaoSelecionada: Profissao;

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private profissaoService: ProfissaoService,
  ) {}

  ngOnInit(): void {
    this.carregaTabelaProfissao();
  }

  private carregaTabelaProfissao(): void {
    this.profissaoService.getAllProfissoes().subscribe(response => {
        this.dataSourceProfissao = new MatTableDataSource<Profissao>(response);
        this.dataSourceProfissao.sort = this.sortProfissao;
        this.dataSourceProfissao.paginator = this.paginatorProfissao;
      }
    );
  }

  selecionaProfissao(profissao: Profissao): void {
    this.estado = null;
    this.profissaoSelecionada = profissao;
    this.profissaoEditando = {...profissao};
    this.editarProfissao();
  }

  editarProfissao(): void {
    this.estado = 'editandoProfissao';
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.profissaoEditando = {...this.profissaoSelecionada};
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.profissaoSelecionada = null;
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.formProfissao?.resetForm();
    this.profissaoSelecionada = new Profissao();
    this.profissaoEditando = this.profissaoSelecionada;
  }

  visualizar(): void {
    this.estado = null;
  }

  limpar(): void {
    this.estado = null;
    this.profissaoEditando = null;
    this.profissaoSelecionada = null;
  }

  editandoProfissao(): boolean {
    return this.estado === 'editandoProfissao';
  }

  adicionandoProfissao(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovaProfissao(): void {
    if (this.formProfissao.valid) {
      this.profissaoService.adicionarProfissao(this.profissaoEditando).subscribe(response => {
        this.snackBar.openSnackBar('Profissao adicionada com sucesso!');
        this.limpar();
        this.carregaTabelaProfissao();
      });
    } else {
      this.erroFormInvalido();
    }
  }

  atualizarProfissao(): void {
    if (this.formProfissao.valid) {
      this.profissaoService.editarProfissao(this.profissaoEditando).subscribe(response => {
        this.snackBar.openSnackBar('Profissao atualizada com sucesso!');
        this.visualizar();
        this.carregaTabelaProfissao();
        this.profissaoSelecionada = response;
      });
    } else {
      this.erroFormInvalido();
    }
  }

  private erroFormInvalido(): void {
    this.formProfissao.form.markAllAsTouched();
    this.snackBar.openSnackBar("Preencha todos os campos!");
  }

  removerProfissao(): void {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Tem certeza?',
        descricao: 'Deseja remover a profissao ' + this.profissaoSelecionada.nome + '?',
        confirma: 'Sim',
        cancela: 'Nao',
      }
    }).afterClosed().subscribe(confirmacao => {
      if (confirmacao) {
        this.profissaoService.excluirProfissao(this.profissaoSelecionada).subscribe(response => {
          this.snackBar.openSnackBar('Profissao apagada com sucesso!');
          this.limpar();
          this.carregaTabelaProfissao();
        });
      }
    });
  }

  onSubmit(): void {
    if (this.adicionandoProfissao()) {
      this.salvarNovaProfissao();
    } else if (this.editandoProfissao()) {
      this.atualizarProfissao();
    }
  }

}
