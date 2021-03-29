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
import {FiltroProduto} from "../../services/produto/filtro-produto";

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
  filtroProduto: FiltroProduto;
  produtoEditando: Produto;
  produtoSelecionado: Produto;
  todosProdutos: Produto[];
  todosHospitais: Hospital[];
  todasOperadoras: Operadora[];
  todosLaboratorios: Laboratorio[];
  todasAbrangencias: Abrangencia[];
  operadoraAutoCompleteControl = new FormControl();
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
    this.operadoraAutoCompleteControl.disable();
    this.filteredOptions = this.operadoraAutoCompleteControl.valueChanges.pipe(
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
      this.todosProdutos = response;
      this.configuraTabelaProduto(this.todosProdutos);
    });
  }

  private configuraTabelaProduto(produtos: Produto[]) {
    this.dataSourceProduto = new MatTableDataSource<Produto>(produtos);
    this.dataSourceProduto.sort = this.sortProduto;
    this.dataSourceProduto.paginator = this.paginatorProduto;
    this.dataSourceProduto.sortingDataAccessor = (produto, property) => {
      const hospitais = this.todosHospitais.filter(h => h.nome === property);
      const laboratorios = this.todosLaboratorios.filter(l => l.nome === property);
      if (laboratorios.length > 0) {
        return this.verificaSeLaboratorioSelecionado(produto, laboratorios.pop());
      }
      if (hospitais.length > 0) {
        return this.verificaSeHospitalSelecionado(produto, hospitais.pop());
      }
      switch (property) {
        case 'valorProntoSocorro' :
          return produto.coparticipacao.valorProntoSocorro
        case 'valorConsulta' :
          return produto.coparticipacao.valorConsulta
        case 'valorInternacao' :
          return produto.coparticipacao.valorInternacao
        case 'valorExameSimples' :
          return produto.coparticipacao.valorExameSimples
        case 'valorExameEspecial' :
          return produto.coparticipacao.valorExameEspecial
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
    this.operadoraAutoCompleteControl.disable();
    this.operadoraAutoCompleteControl.setValue(this.produtoEditando.operadora);
    this.carregaTabelasAdicionais(this.produtoEditando);
    this.editarProduto();
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
    this.operadoraAutoCompleteControl.enable();
    this.preparaTodosParaNovaVerificacao();
    this.configuraLaboratoriosParaEdicao();
    this.configuraHospitaisParaEdicao();
    setTimeout(() => this.accordion.openAll());
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
    this.operadoraAutoCompleteControl.disable();
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.produtoSelecionado = null;
    this.operadoraAutoCompleteControl.disable();
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.produtoSelecionado = new Produto();
    this.operadoraAutoCompleteControl.enable();
    this.operadoraAutoCompleteControl.setValue('');
    this.produtoEditando = this.produtoSelecionado;
    this.preparaTodosParaNovaVerificacao();
    this.configuraLaboratoriosParaEdicao();
    this.configuraHospitaisParaEdicao();
    setTimeout(() => this.accordion.openAll());
  }

  visualizar(): void {
    this.estado = null;
    this.operadoraAutoCompleteControl.disable();
  }

  limpar(): void {
    this.estado = null;
    this.produtoEditando = null;
    this.produtoSelecionado = null;
    this.operadoraAutoCompleteControl.disable();
    this.preparaTodosParaNovaVerificacao();
  }

  editandoProduto(): boolean {
    return this.estado === 'editandoProduto';
  }

  adicionandoProduto(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovoProduto(): void {
    this.produtoEditando.operadora = this.operadoraAutoCompleteControl.value;
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
    this.produtoEditando.operadora = this.operadoraAutoCompleteControl.value;
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

  filtrandoProduto(): boolean {
    return this.estado === 'filtrando';
  }

  filtrar(): void {
    this.estado = 'filtrando';
    this.produtoSelecionado = null;
    this.filtroProduto = new FiltroProduto();
  }

  filtraProduto() {
    setTimeout(() => {
      let produtosFiltrados = this.todosProdutos;

      if (this.filtroProduto.ativo != null) {
        produtosFiltrados = this.todosProdutos.filter(p => p.ativo === this.filtroProduto.ativo);
      }

      if (this.filtroProduto.nome) {
        produtosFiltrados = produtosFiltrados.filter(p => p.nome.toLowerCase().includes(this.filtroProduto.nome.toLowerCase()));
      }

      if (this.filtroProduto.abrangencia) {
        produtosFiltrados = produtosFiltrados.filter(p => p.abrangencia === this.filtroProduto.abrangencia);
      }

      if (this.filtroProduto.operadoras.length > 0) {
        produtosFiltrados = produtosFiltrados.filter(p => this.filtroProduto.operadoras.filter(op => op.id === p.operadora.id).length > 0);
      }

      if (this.filtroProduto.laboratorios.length > 0) {
        produtosFiltrados = produtosFiltrados.filter(p => p.laboratorios.filter(l => this.filtroProduto.laboratorios.filter(lf => l.id === lf.id).length > 0).length === this.filtroProduto.laboratorios.length);
      }

      if (this.filtroProduto.hospitais.length > 0) {
        produtosFiltrados = produtosFiltrados.filter(p => p.hospitais.filter(h => this.filtroProduto.hospitais.filter(hf => h.id === hf.id).length > 0).length === this.filtroProduto.hospitais.length);
      }

      if (this.filtroProduto.tipoFiltro) {

        produtosFiltrados = this.filtraProdutoPorReembolso(produtosFiltrados, this.filtroProduto.tipoFiltro);
        produtosFiltrados = this.filtraProdutoPorValorProntoSocorro(produtosFiltrados, this.filtroProduto.tipoFiltro);
        produtosFiltrados = this.filtraProdutoPorValorExameSimples(produtosFiltrados, this.filtroProduto.tipoFiltro);
        produtosFiltrados = this.filtraProdutoPorValorExameEspecial(produtosFiltrados, this.filtroProduto.tipoFiltro);
        produtosFiltrados = this.filtraProdutoPorValorInternacao(produtosFiltrados, this.filtroProduto.tipoFiltro);
        produtosFiltrados = this.filtraProdutoPorValorConsulta(produtosFiltrados, this.filtroProduto.tipoFiltro);

      }

      this.configuraTabelaProduto(produtosFiltrados);

    });
  }

  private filtraProdutoPorReembolso(produtosFiltrados: Produto[], tipoFiltro: string) {
    if (this.filtroProduto.reembolso > 0) {
      switch (tipoFiltro) {
        case '<':
          return produtosFiltrados.filter(p => p.reembolso <= this.filtroProduto.reembolso);
        case '=':
          return produtosFiltrados.filter(p => p.reembolso === this.filtroProduto.reembolso);
        case '>':
          return produtosFiltrados.filter(p => p.reembolso >= this.filtroProduto.reembolso);
      }
    }
    return produtosFiltrados;
  }

  private filtraProdutoPorValorProntoSocorro(produtosFiltrados: Produto[], tipoFiltro: string) {
    if (this.filtroProduto.coparticipacao.valorProntoSocorro > 0) {
      switch (tipoFiltro) {
        case '<':
          return produtosFiltrados.filter(p => p.coparticipacao.valorProntoSocorro <= this.filtroProduto.coparticipacao.valorProntoSocorro);
        case '=':
          return produtosFiltrados.filter(p => p.coparticipacao.valorProntoSocorro === this.filtroProduto.coparticipacao.valorProntoSocorro);
        case '>':
          return produtosFiltrados.filter(p => p.coparticipacao.valorProntoSocorro >= this.filtroProduto.coparticipacao.valorProntoSocorro);
      }
    }
    return produtosFiltrados;
  }

  private filtraProdutoPorValorExameSimples(produtosFiltrados: Produto[], tipoFiltro: string) {
    if (this.filtroProduto.coparticipacao.valorExameSimples > 0) {
      switch (tipoFiltro) {
        case '<':
          return produtosFiltrados.filter(p => p.coparticipacao.valorExameSimples <= this.filtroProduto.coparticipacao.valorExameSimples);
        case '=':
          return produtosFiltrados.filter(p => p.coparticipacao.valorExameSimples === this.filtroProduto.coparticipacao.valorExameSimples);
        case '>':
          return produtosFiltrados.filter(p => p.coparticipacao.valorExameSimples >= this.filtroProduto.coparticipacao.valorExameSimples);
      }
    }
    return produtosFiltrados;
  }

  private filtraProdutoPorValorExameEspecial(produtosFiltrados: Produto[], tipoFiltro: string) {
    if (this.filtroProduto.coparticipacao.valorExameEspecial > 0) {
      switch (tipoFiltro) {
        case '<':
          return produtosFiltrados.filter(p => p.coparticipacao.valorExameEspecial <= this.filtroProduto.coparticipacao.valorExameEspecial);
        case '=':
          return produtosFiltrados.filter(p => p.coparticipacao.valorExameEspecial === this.filtroProduto.coparticipacao.valorExameEspecial);
        case '>':
          return produtosFiltrados.filter(p => p.coparticipacao.valorExameEspecial >= this.filtroProduto.coparticipacao.valorExameEspecial);
      }
    }
    return produtosFiltrados;
  }

  private filtraProdutoPorValorInternacao(produtosFiltrados: Produto[], tipoFiltro: string) {
    if (this.filtroProduto.coparticipacao.valorInternacao > 0) {
      switch (tipoFiltro) {
        case '<':
          return produtosFiltrados.filter(p => p.coparticipacao.valorInternacao <= this.filtroProduto.coparticipacao.valorInternacao);
        case '=':
          return produtosFiltrados.filter(p => p.coparticipacao.valorInternacao === this.filtroProduto.coparticipacao.valorInternacao);
        case '>':
          return produtosFiltrados.filter(p => p.coparticipacao.valorInternacao >= this.filtroProduto.coparticipacao.valorInternacao);
      }
    }
    return produtosFiltrados;
  }

  private filtraProdutoPorValorConsulta(produtosFiltrados: Produto[], tipoFiltro: string) {
    if (this.filtroProduto.coparticipacao.valorConsulta > 0) {
      switch (tipoFiltro) {
        case '<':
          return produtosFiltrados.filter(p => p.coparticipacao.valorConsulta <= this.filtroProduto.coparticipacao.valorConsulta);
        case '=':
          return produtosFiltrados.filter(p => p.coparticipacao.valorConsulta === this.filtroProduto.coparticipacao.valorConsulta);
        case '>':
          return produtosFiltrados.filter(p => p.coparticipacao.valorConsulta >= this.filtroProduto.coparticipacao.valorConsulta);
      }
    }
    return produtosFiltrados;
  }

  cancelarFiltro(): void {
    this.cancelarAdicao();
    this.configuraTabelaProduto(this.todosProdutos);
  }
}
