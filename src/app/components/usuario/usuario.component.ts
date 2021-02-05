import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {UsuarioService} from '../../services/usuario/usuario.service';
import {Usuario} from './usuario';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nome', 'email', 'password', 'roles'];
  dataSource = new MatTableDataSource();

  constructor(
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.usuarioService.getAllUsuarios().subscribe(response => {
        this.dataSource = new MatTableDataSource<Usuario>(response);
        this.dataSource.sort = this.sort;
      }
    );
  }

}
