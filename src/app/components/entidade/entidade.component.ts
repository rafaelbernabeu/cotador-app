import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Usuario} from '../../services/usuario/usuario';
import {EntidadeService} from '../../services/entidade/entidade.service';
import {Entidade} from '../../services/entidade/entidade';

@Component({
  selector: 'app-entidade',
  templateUrl: './entidade.component.html',
  styleUrls: ['./entidade.component.scss']
})
export class EntidadeComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['id', 'nome'];
  dataSource = new MatTableDataSource<Entidade>();

  constructor(
    private entidadeService: EntidadeService
  ) {}

  ngOnInit(): void {
    this.entidadeService.getAllEntidades().subscribe(response => {
        this.dataSource = new MatTableDataSource<Entidade>(response);
        this.dataSource.sort = this.sort;
      }
    );
  }
}
