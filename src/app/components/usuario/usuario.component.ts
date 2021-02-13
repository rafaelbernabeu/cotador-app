import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {UsuarioService} from '../../services/usuario/usuario.service';
import {Usuario} from '../../services/usuario/usuario';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['nome', 'email', 'password', 'roles'];
  dataSource = new MatTableDataSource();

  constructor(
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.usuarioService.getAllUsuarios().subscribe(response => {
        this.dataSource = new MatTableDataSource<Usuario>(response);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    );
  }

  adicionar(): void {

  }
}
