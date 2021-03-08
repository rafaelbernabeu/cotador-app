import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {ProdutoService} from '../../services/produto/produto.service';
import {DialogComponent} from '../dialog/dialog.component';
import {Produto} from '../../services/produto/produto';
import {Operadora} from '../../services/operadora/operadora';
import {OperadoraService} from '../../services/operadora/operadora.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAccordion} from '@angular/material/expansion';
import {Laboratorio} from '../../services/laboratorio/laboratorio';
import {LaboratorioService} from '../../services/laboratorio/laboratorio.service';
import {Hospital} from '../../services/hospital/hospital';
import {HospitalService} from '../../services/hospital/hospital.service';
import {AbrangenciaService} from '../../services/abrangencia/abrangencia.service';
import {Abrangencia} from '../../services/abrangencia/abrangencia';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {

  @ViewChild('sortProduto') sortProduto: MatSort;
  @ViewChild('paginatorProduto') paginatorProduto: MatPaginator;

  @ViewChild('sortLaboratorio') sortLaboratorio: MatSort;
  @ViewChild('paginatorLaboratorio') paginatorLaboratorio: MatPaginator;
  @ViewChild('sortLaboratorioEditando') sortLaboratorioEditando: MatSort;
  @ViewChild('paginatorLaboratorioEditando') paginatorLaboratorioEditando: MatPaginator;

  @ViewChild('sortHospital') sortHospital: MatSort;
  @ViewChild('paginatorHospital') paginatorHospital: MatPaginator;
  @ViewChild('sortHospitalEditando') sortHospitalEditando: MatSort;
  @ViewChild('paginatorHospitalEditando') paginatorHospitalEditando: MatPaginator;

  @ViewChild(MatAccordion) accordion: MatAccordion;

  displayedColumns: string[] = ['id', 'nome', 'abrangencia', 'operadora', 'reembolso', 'valorProntoSocorro', 'valorConsulta', 'valorExameSimples', 'valorExameEspecial', 'valorInternacao'];
  dataSourceProduto = new MatTableDataSource<Produto>();
  dataSourceHospital = new MatTableDataSource<Hospital>();
  dataSourceLaboratorio = new MatTableDataSource<Laboratorio>();

  estado: string;
  produtoEditando: Produto;
  produtoSelecionado: Produto;
  todosHospitais: Hospital[];
  todasOperadoras: Operadora[];
  todosLaboratorios: Laboratorio[];
  todasAbrangencias: Abrangencia[];
  autoCompleteControl = new FormControl();
  filteredOptions: Observable<Operadora[]>;

  constructor(
    @Inject('Window') public window: Window,

    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private produtoService: ProdutoService,
    private hospitalService: HospitalService,
    private operadoraService: OperadoraService,
    private laboratorioService: LaboratorioService,
    private abrangenciaService: AbrangenciaService,
  ) {}

  ngOnInit(): void {
    this.autoCompleteControl.disable();
    this.filteredOptions = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.filterAutoComplete(value))
    );

    this.operadoraService.getAllOperadoras().subscribe(response => this.todasOperadoras = response);
    this.abrangenciaService.getAllAbrangencias().subscribe(response => this.todasAbrangencias = response);
    this.laboratorioService.getAllLaboratorios().subscribe(response => {
      this.todosLaboratorios = response;
      this.displayedColumns.push(...this.todosLaboratorios.map(l => l.nome));
      this.displayedColumns.push('totalLaboratorios')
      this.hospitalService.getAllHospitais().subscribe(response => {
        this.todosHospitais = response;
        this.displayedColumns.push(...this.todosHospitais.map(l => l.nome));
        this.displayedColumns.push('totalHospitais')
      });
    });
    this.carregaTabelaProduto();
  }

  private carregaTabelaProduto(): void {
    this.produtoService.getAllProdutos().subscribe(response => {
      this.dataSourceProduto = new MatTableDataSource<Produto>(response);
      this.dataSourceProduto.sort = this.sortProduto;
      this.dataSourceProduto.paginator = this.paginatorProduto;
      this.dataSourceProduto.sortingDataAccessor = (produto, property) => {
        const hospitais = this.todosHospitais.filter(h => h.nome === property);
        const laboratorios = this.todosLaboratorios.filter(l => l.nome === property);
        if (laboratorios.length !== 0) {
          return this.verificaSeLaboratorioSelecionado(produto, laboratorios.pop());
        }
        if (hospitais.length !== 0) {
          return this.verificaSeHospitalSelecionado(produto, hospitais.pop());
        }
        switch (property) {
          case 'operadora':
            return produto.operadora.nome;
          case 'totalLaboratorios':
            return produto.laboratorios.length;
          case 'totalHospitais':
            return produto.hospitais.length;
          default:
            return produto[property];
        }
      };
    });
  }

  private carregaTabelaLaboratorio(laboratorios: Laboratorio[]): void {
    this.dataSourceLaboratorio = new MatTableDataSource<Laboratorio>(laboratorios);
    if (this.editandoProduto() || this.adicionandoProduto()) {
      this.dataSourceLaboratorio.sort = this.sortLaboratorioEditando;
      this.dataSourceLaboratorio.paginator = this.paginatorLaboratorioEditando;
    } else {
      this.dataSourceLaboratorio.sort = this.sortLaboratorio;
      this.dataSourceLaboratorio.paginator = this.paginatorLaboratorio;
    }
    this.dataSourceLaboratorio.sortingDataAccessor = (laboratorio, property) => {
      switch (property) {
        case 'estado':
          return laboratorio.estado.sigla;
        default:
          return laboratorio[property];
      }
    };
  }

  private carregaTabelaHospital(hospitais: Hospital[]): void {
    this.dataSourceHospital = new MatTableDataSource<Hospital>(hospitais);
    if (this.editandoProduto() || this.adicionandoProduto()) {
      this.dataSourceHospital.sort = this.sortHospitalEditando;
      this.dataSourceHospital.paginator = this.paginatorHospitalEditando;
    } else {
      this.dataSourceHospital.sort = this.sortHospital;
      this.dataSourceHospital.paginator = this.paginatorHospital;
    }
  }

  selecionaProduto(produto: Produto): void {
    this.estado = null;
    this.produtoSelecionado = produto;
    this.produtoEditando = {...produto};
    this.autoCompleteControl.disable();
    this.autoCompleteControl.setValue(this.produtoEditando.operadora);
    this.carregaTabelasAdicionais(this.produtoEditando);
  }

  copiarProduto(): void {
    this.editarProduto();
    this.produtoEditando.id = null;
    this.produtoEditando.coparticipacao.id = null;
    this.produtoEditando.nome = '';
    this.estado = 'adicionando';
  }

  editarProduto(): void {
    this.estado = 'editandoProduto';
    this.autoCompleteControl.enable();
    this.preparaTodosParaNovaVerificacao();
    this.configuraLaboratoriosParaEdicao();
    this.configuraHospitaisParaEdicao();
  }

  configuraLaboratoriosParaEdicao(): void {
    this.todosLaboratorios.forEach(todos => {
      this.produtoSelecionado.laboratorios.forEach(laboratorio => {
        if (todos.id === laboratorio.id) {
          todos.selected = true;
        }
      });
    });
    this.carregaTabelaLaboratorio(this.todosLaboratorios);
  }

  configuraHospitaisParaEdicao(): void {
    this.todosHospitais.forEach(todos => {
      this.produtoSelecionado.hospitais.forEach(hospital => {
        if (todos.id === hospital.id) {
          todos.selected = true;
        }
      });
    });
    this.carregaTabelaHospital(this.todosHospitais);
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.produtoEditando = {...this.produtoSelecionado};
    this.autoCompleteControl.disable();
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.produtoSelecionado = null;
    this.autoCompleteControl.disable();
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.produtoSelecionado = new Produto();
    this.autoCompleteControl.enable();
    this.autoCompleteControl.setValue('');
    this.produtoEditando = this.produtoSelecionado;
    this.preparaTodosParaNovaVerificacao();
    this.configuraLaboratoriosParaEdicao();
    this.configuraHospitaisParaEdicao();
  }

  visualizar(): void {
    this.estado = null;
    this.autoCompleteControl.disable();
  }

  limpar(): void {
    this.estado = null;
    this.produtoEditando = null;
    this.produtoSelecionado = null;
    this.autoCompleteControl.disable();
    this.preparaTodosParaNovaVerificacao();
  }

  editandoProduto(): boolean {
    return this.estado === 'editandoProduto';
  }

  adicionandoProduto(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovoProduto(): void {
    this.produtoEditando.operadora = this.autoCompleteControl.value;
    this.produtoEditando.hospitais = this.todosHospitais.filter(l => l.selected);
    this.produtoEditando.laboratorios = this.todosLaboratorios.filter(l => l.selected);
    this.produtoService.adicionarProduto(this.produtoEditando).subscribe(response => {
      this.snackBar.openSnackBar('Produto adicionado com sucesso!');
      this.limpar();
      this.carregaTabelaProduto();
    });
  }

  private preparaTodosParaNovaVerificacao(): void {
    this.todosHospitais.forEach(p => p.selected = false);
    this.todosLaboratorios.forEach(p => p.selected = false);
  }

  atualizarProduto(): void {
    this.produtoEditando.operadora = this.autoCompleteControl.value;
    this.produtoEditando.hospitais = this.todosHospitais.filter(l => l.selected);
    this.produtoEditando.laboratorios = this.todosLaboratorios.filter(l => l.selected);
    this.produtoService.editarProduto(this.produtoEditando).subscribe(response => {
      this.snackBar.openSnackBar('Produto atualizado com sucesso!');
      this.visualizar();
      this.carregaTabelaProduto();
      this.produtoSelecionado = response;
      this.carregaTabelasAdicionais(this.produtoSelecionado);
    });
  }

  private carregaTabelasAdicionais(produto: Produto): void {
    this.carregaTabelaLaboratorio(produto.laboratorios);
    this.carregaTabelaHospital(produto.hospitais);
  }

  removerProduto(): void {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Tem certeza?',
        descricao: 'Deseja remover o produto ' + this.produtoSelecionado.nome + '?',
        confirma: 'Sim',
        cancela: 'Nao',
      }
    }).afterClosed().subscribe(confirmacao => {
      if (confirmacao) {
        this.produtoService.excluirProduto(this.produtoSelecionado).subscribe(response => {
          this.snackBar.openSnackBar('Produto apagado com sucesso!');
          this.limpar();
          this.carregaTabelaProduto();
        });
      }
    });
  }

  private filterAutoComplete(value: string): Operadora[] {
    const filterValue = value?.toLowerCase();
    return this.todasOperadoras.filter(operadora => operadora.nome.toLowerCase().includes(filterValue));
  }

  displayFn(operadora: Operadora): string {
    return operadora && operadora.nome ? operadora.nome : '';
  }

  verificaSeLaboratorioSelecionado(produto: Produto, laboratorio: Laboratorio): boolean {
    return produto.laboratorios.filter(lab => lab.id === laboratorio.id).length !== 0
  }

  verificaSeHospitalSelecionado(produto: Produto, hospital: Hospital) {
    return produto.hospitais.filter(hosp => hosp.id === hospital.id).length !== 0
  }
}
