import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {UsuarioService} from '../../services/usuario/usuario.service';
import {Usuario} from '../../services/usuario/usuario';
import {MatPaginator} from '@angular/material/paginator';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {RoleService} from '../../services/role/role.service';
import {Role} from '../../services/role/role';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

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
  roles: Role[];
  todasRoles: Role[];
  usuarioEditando: Usuario;
  usuarioSelecionado: Usuario;

  constructor(
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
    this.preparaParaNovaVerificacao();

    this.usuarioService.getRolesByUsuario(usuario).subscribe(response => {
      this.roles = response;

      this.todasRoles.forEach(todas => {
        this.roles.forEach(role => {
          if (todas.role === role.role) {
            todas.selected = true;
          }
        });
      });
      this.configuraDataSource();
    });
  }

  editarRelacionamento(): void {
    this.estado = 'editandoRelacionamento';
    this.usuarioEditando = {...this.usuarioSelecionado};
    this.configuraDataSource();
  }

  editarUsuario(): void {
    const estadoAnterior = this.estado;
    this.estado = 'editandoUsuario';
    if (estadoAnterior === 'editandoRelacionamento') {
      this.configuraDataSource();
    }
  }

  salvarRoles(): void {
    const rolesSelecionadas = this.todasRoles.filter(p => p.selected);
    this.usuarioService.atualizarRolesDoUsuario(this.usuarioSelecionado, rolesSelecionadas).subscribe(response => {
      this.snackBar.openSnackBar('Dados salvos com sucesso!');
      this.roles = response;
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
    this.usuarioEditando = {...this.usuarioSelecionado};
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.usuarioSelecionado = null;
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.roles = null;
    this.usuarioSelecionado = new Usuario();
    this.usuarioEditando = this.usuarioSelecionado;
  }

  visualizar(): void {
    this.estado = null;
  }

  limpar(): void {
    this.estado = null;
    this.roles = null;
    this.usuarioEditando = null;
    this.usuarioSelecionado = null;
  }

  private configuraDataSource(): void {
    if (this.estado === 'editandoRelacionamento') {
      this.dataSourceRoles = new MatTableDataSource<Role>(this.todasRoles);
      this.dataSourceRoles.sort = this.sortProfissaoEditando;
      this.dataSourceRoles.paginator = this.paginatorEditandoProfissao;
    } else {
      this.dataSourceRoles = new MatTableDataSource<Role>(this.roles);
      this.dataSourceRoles.sort = this.sortProfissao;
      this.dataSourceRoles.paginator = this.paginatorProfissao;
    }
  }

  private preparaParaNovaVerificacao(): void {
    this.todasRoles.forEach(p => p.selected = false);
  }

  editandoRelacionamento(): boolean {
    return this.estado === 'editandoRelacionamento';
    this.configuraDataSource();
  }

  editandoUsuario(): boolean {
    return this.estado === 'editandoUsuario';
  }

  adicionandoUsuario(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovoUsuario(): void {
    this.usuarioService.adicionarUsuario(this.usuarioEditando).subscribe(response => {
      this.snackBar.openSnackBar('Usuario adicionado com sucesso!');
      this.limpar();
      this.carregaTabelaUsuarios();
    });
  }

  atualizarUsuario(): void {
    this.usuarioService.editarUsuario(this.usuarioEditando).subscribe(response => {
      this.snackBar.openSnackBar('Usuario atualizado com sucesso!');
      this.visualizar();
      this.carregaTabelaUsuarios();
      this.usuarioSelecionado = response;
    });
  }

  removerUsuario(): void {
    this.usuarioService.excluirUsuario(this.usuarioSelecionado).subscribe(response => {
      this.snackBar.openSnackBar('Usuario apagado com sucesso!');
      this.limpar();
      this.carregaTabelaUsuarios();
    });
  }

}
