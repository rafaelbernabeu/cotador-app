import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {UsuarioService} from '../../services/usuario/usuario.service';
import {Usuario} from '../../services/usuario/usuario';
import {MatPaginator} from '@angular/material/paginator';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {RoleService} from '../../services/role/role.service';
import {Role} from '../../services/role/role';
import {DialogComponent} from '../dialog/dialog.component';
import {MatDialog} from '@angular/material/dialog';
import * as bcrypt from 'bcryptjs';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  @ViewChild('usuarioForm') formUsuario: NgForm;
  @ViewChild('usuariosSort') sortUsuario: MatSort;
  @ViewChild('rolesSort') sortProfissao: MatSort;
  @ViewChild('paginatorUsuarios') paginatorUsuario: MatPaginator;
  @ViewChild('paginatorRoles') paginatorProfissao: MatPaginator;
  @ViewChild('rolesSortEditando') sortProfissaoEditando: MatSort;
  @ViewChild('paginatorEditandoRoles') paginatorEditandoProfissao: MatPaginator;

  displayedColumns: string[] = ['id', 'nome', 'email'];
  dataSourceRoles = new MatTableDataSource<Role>();
  dataSourceUsuario = new MatTableDataSource<Usuario>();

  estado: string;
  todasRoles: Role[];
  usuarioEditando: Usuario;
  usuarioSelecionado: Usuario;

  constructor(
    private dialog: MatDialog,
    private roleService: RoleService,
    private snackBar: SnackbarService,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.carregaTabelaUsuarios();

    this.roleService.getAllRoles().subscribe(response => {
      this.todasRoles = response;
    });
  }

  private carregaTabelaUsuarios(): void {
    this.usuarioService.getAllUsuarios().subscribe(response => {
        this.dataSourceUsuario = new MatTableDataSource<Usuario>(response);
        this.dataSourceUsuario.sort = this.sortUsuario;
        this.dataSourceUsuario.paginator = this.paginatorUsuario;
      }
    );
  }

  selecionarUsuario(usuario: Usuario): void {
    this.estado = null;
    this.usuarioSelecionado = usuario;
    this.usuarioEditando = {...usuario};
    this.formUsuario?.form.markAsUntouched();
    this.carregaTabelaRoles(this.usuarioSelecionado.roles);
    this.editarUsuario();
  }

  editarUsuario(): void {
    this.estado = 'editandoUsuario';
    this.preparaRolesParaNovaVerificacao();
    this.todasRoles.forEach(todas => {
      this.usuarioSelecionado.roles.forEach(role => {
        if (todas.role === role.role) {
          todas.selected = true;
        }
      });
    });
    this.carregaTabelaRoles(this.todasRoles);
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.usuarioEditando = {...this.usuarioSelecionado};
    this.carregaTabelaRoles(this.usuarioSelecionado.roles);
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.usuarioSelecionado = null;
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.formUsuario?.resetForm();
    this.usuarioSelecionado = new Usuario();
    this.usuarioEditando = this.usuarioSelecionado;
    this.preparaRolesParaNovaVerificacao();
    this.carregaTabelaRoles(this.todasRoles);
  }

  visualizar(): void {
    this.estado = null;
  }

  limpar(): void {
    this.estado = null;
    this.usuarioEditando = null;
    this.usuarioSelecionado = null;
  }

  private carregaTabelaRoles(roles: Role[]): void {
    this.dataSourceRoles = new MatTableDataSource<Role>(roles);
    if (this.editandoUsuario() || this.adicionandoUsuario()) {
      this.dataSourceRoles.sort = this.sortProfissaoEditando;
      this.dataSourceRoles.paginator = this.paginatorEditandoProfissao;
    } else {
      this.dataSourceRoles.sort = this.sortProfissao;
      this.dataSourceRoles.paginator = this.paginatorProfissao;
    }
  }

  private preparaRolesParaNovaVerificacao(): void {
    this.todasRoles.forEach(p => p.selected = false);
  }

  editandoUsuario(): boolean {
    return this.estado === 'editandoUsuario';
  }

  adicionandoUsuario(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovoUsuario(): void {
    if (this.formUsuario.valid) {
      this.usuarioEditando.roles = this.todasRoles.filter(r => r.selected);
      this.usuarioEditando.password = bcrypt.hashSync(this.usuarioEditando.password, 10);
      this.usuarioService.adicionarUsuario(this.usuarioEditando).subscribe(response => {
        this.snackBar.openSnackBar('Usuario adicionado com sucesso!');
        this.limpar();
        this.carregaTabelaUsuarios();
      });
    } else {
      this.erroFormInvalido();
    }
  }

  atualizarUsuario(): void {
    if (this.formUsuario.valid) {
      this.usuarioEditando.roles = this.todasRoles.filter(r => r.selected);
      this.usuarioService.editarUsuario(this.usuarioEditando).subscribe(response => {
        this.snackBar.openSnackBar('Usuario atualizado com sucesso!');
        this.visualizar();
        this.carregaTabelaUsuarios();
        this.usuarioSelecionado = response;
        this.carregaTabelaRoles(this.usuarioSelecionado.roles);
      });
    } else {
      this.erroFormInvalido();
    }
  }

  private erroFormInvalido(): void {
    this.formUsuario.form.markAllAsTouched();
    this.snackBar.openSnackBar("Preencha todos os campos!");
  }

  removerUsuario(): void {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Tem certeza?',
        descricao: 'Deseja remover o usuario ' + this.usuarioSelecionado.nome + '?',
        confirma: 'Sim',
        cancela: 'Nao',
      }
    }).afterClosed().subscribe(confirmacao => {
      if (confirmacao) {
        this.usuarioService.excluirUsuario(this.usuarioSelecionado).subscribe(response => {
          this.snackBar.openSnackBar('Usuario removido com sucesso!');
          this.limpar();
          this.carregaTabelaUsuarios();
        });
      }
    });
  }

  onSubmit(): void {
    if (this.adicionandoUsuario()) {
      this.salvarNovoUsuario();
    } else if (this.editandoUsuario()) {
      this.atualizarUsuario();
    }
  }

}
