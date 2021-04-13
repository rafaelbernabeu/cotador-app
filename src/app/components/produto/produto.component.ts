import {Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
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
import {FormControl, NgForm, Validators} from '@angular/forms';
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
import {UtilService} from "../../services/util/util.service";

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {

  @ViewChild('formProduto') formProduto: NgForm;
  @ViewChild('formCoparts') formCoparts: NgForm;
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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if ((this.adicionandoProduto() || this.editandoProduto()) && event.code === 'Enter') {
        event.preventDefault();
        this.onSubmit();
      } else if (this.produtoSelecionado && event.code === 'KeyD') {
        event.preventDefault();
        this.copiarProduto();
      }
    }
  }

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
  operadoraAutoCompleteControl = new FormControl(Validators.required);
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
    this.paginatorProduto._changePageSize(5);
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
    this.paginatorProduto._changePageSize(100);
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.formProduto?.resetForm();
    this.formCoparts?.resetForm();
    this.operadoraAutoCompleteControl?.reset();
    this.produtoSelecionado = new Produto();
    this.operadoraAutoCompleteControl.enable();
    this.operadoraAutoCompleteControl.setValue('');
    this.produtoEditando = this.produtoSelecionado;
    this.paginatorProduto._changePageSize(5);
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
    this.paginatorProduto._changePageSize(100);
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
    if (this.isFormValido()) {
      this.produtoService.adicionarProduto(this.produtoEditando).subscribe(response => {
        this.snackBar.openSnackBar('Produto adicionado com sucesso!');
        this.limpar();
        this.carregaTabelaProduto();
      });
    } else {
      this.erroFormInvalido();
    }
  }

  private preparaTodosParaNovaVerificacao(): void {
    this.todosHospitais.forEach(p => p.selected = false);
    this.todosLaboratorios.forEach(p => p.selected = false);
  }

  atualizarProduto(): void {
    this.produtoEditando.operadora = this.operadoraAutoCompleteControl.value;
    this.produtoEditando.hospitais = this.todosHospitais.filter(l => l.selected);
    this.produtoEditando.laboratorios = this.todosLaboratorios.filter(l => l.selected);
    if (this.isFormValido()) {
      this.produtoService.editarProduto(this.produtoEditando).subscribe(response => {
        this.snackBar.openSnackBar('Produto atualizado com sucesso!');
        this.visualizar();
        this.carregaTabelaProduto();
        this.produtoSelecionado = response;
        this.carregaTabelasAdicionais(this.produtoSelecionado);
      });
    } else {
      this.erroFormInvalido();
    }
  }

  private erroFormInvalido(): void {
    this.formProduto.form.markAllAsTouched();
    this.formCoparts.form.markAllAsTouched();
    if (!this.operadoraAutoCompleteControl.value.id) {
      this.operadoraAutoCompleteControl.setValue('');
      this.operadoraAutoCompleteControl.markAllAsTouched()
    }
    this.snackBar.openSnackBar("Preencha todos os campos!");
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

      if (this.filtroProduto.ativo != null && typeof this.filtroProduto.ativo === "boolean") {
        produtosFiltrados = this.todosProdutos.filter(p => p.ativo === this.filtroProduto.ativo);
      }

      if (this.filtroProduto.nome) {
        produtosFiltrados = produtosFiltrados.filter(p => p.nome.toLowerCase().includes(this.filtroProduto.nome.toLowerCase()));
      }

      if (this.filtroProduto.abrangencia) {
        produtosFiltrados = produtosFiltrados.filter(p => p.abrangencia === this.filtroProduto.abrangencia);
      }

      if (this.filtroProduto.operadoras.length) {
        produtosFiltrados = produtosFiltrados.filter(p => this.filtroProduto.operadoras.filter(op => op.id === p.operadora.id).length);
      }

      if (this.filtroProduto.laboratorios.length) {
        produtosFiltrados = produtosFiltrados.filter(p => p.laboratorios.filter(l => this.filtroProduto.laboratorios.filter(lf => l.id === lf.id).length).length === this.filtroProduto.laboratorios.length);
      }

      if (this.filtroProduto.hospitais.length) {
        produtosFiltrados = produtosFiltrados.filter(p => p.hospitais.filter(h => this.filtroProduto.hospitais.filter(hf => h.id === hf.id).length).length === this.filtroProduto.hospitais.length);
      }

      if (this.filtroProduto.tipoFiltro) {

        produtosFiltrados = UtilService.filtraListaPorValorProperty(produtosFiltrados, this.filtroProduto, 'reembolso');
        produtosFiltrados = this.filtraProdutoPorCoparticipacao(produtosFiltrados, this.filtroProduto, 'valorProntoSocorro');
        produtosFiltrados = this.filtraProdutoPorCoparticipacao(produtosFiltrados, this.filtroProduto, 'valorExameSimples');
        produtosFiltrados = this.filtraProdutoPorCoparticipacao(produtosFiltrados, this.filtroProduto, 'valorExameEspecial');
        produtosFiltrados = this.filtraProdutoPorCoparticipacao(produtosFiltrados, this.filtroProduto, 'valorInternacao');
        produtosFiltrados = this.filtraProdutoPorCoparticipacao(produtosFiltrados, this.filtroProduto, 'valorConsulta');

      }

      this.configuraTabelaProduto(produtosFiltrados);

    });
  }

  private filtraProdutoPorCoparticipacao(produtosFiltrados: Produto[], filtro: any, property: string) {
    if (filtro.coparticipacao[property]) {
      switch (filtro.tipoFiltro) {
        case '<':
          return produtosFiltrados.filter(p => p.coparticipacao[property] <= filtro.coparticipacao[property]);
        case '=':
          return produtosFiltrados.filter(p => p.coparticipacao[property] === filtro.coparticipacao[property]);
        case '>':
          return produtosFiltrados.filter(p => p.coparticipacao[property] >= filtro.coparticipacao[property]);
      }
    }
    return produtosFiltrados;
  }

  cancelarFiltro(): void {
    this.cancelarAdicao();
  }

  onSubmit(): void {
    if (this.adicionandoProduto()) {
      this.salvarNovoProduto();
    } else if (this.editandoProduto()) {
      this.atualizarProduto();
    }
  }

  isFormValido(): boolean {
    return this.formProduto.valid &&
      this.formCoparts.valid &&
      this.produtoEditando.operadora?.id &&
      this.produtoEditando.hospitais.length > 0 &&
      this.produtoEditando.laboratorios.length > 0;
  }

}
