import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {OpcaoService} from '../../services/opcao/opcao.service';
import {DialogComponent} from '../dialog/dialog.component';
import {Opcao} from '../../services/opcao/opcao';
import {MatAccordion} from '@angular/material/expansion';
import {Produto} from '../../services/produto/produto';
import {Reajuste} from '../../services/reajuste/reajuste';
import {Estado} from '../../services/estado/estado';
import {Categoria} from '../../services/categoria/categoria';
import {Operadora} from '../../services/operadora/operadora';
import {Administradora} from '../../services/administradora/administradora';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {EstadoService} from '../../services/estado/estado.service';
import {OperadoraService} from '../../services/operadora/operadora.service';
import {CategoriaService} from '../../services/categoria/categoria.service';
import {AdministradoraService} from '../../services/administradora/administradora.service';
import {map, startWith} from 'rxjs/operators';
import {Tabela} from '../../services/tabela/tabela';
import {Acomodacao} from '../../services/acomodacao/Acomodacao';
import {AcomodacaoService} from '../../services/acomodacao/acomodacao.service';
import {TabelaService} from '../../services/tabela/tabela.service';

@Component({
  selector: 'app-opcao',
  templateUrl: './opcao.component.html',
  styleUrls: ['./opcao.component.scss']
})
export class OpcaoComponent implements OnInit {

  @ViewChild(MatSort) sortOpcao: MatSort;
  @ViewChild(MatPaginator) paginatorOpcao: MatPaginator;

  @ViewChild(MatAccordion) accordion: MatAccordion;

  displayedColumns: string[] = ['id', 'estado', 'nomeTabela', 'nomeProduto', 'acomodacao', 'coparticipacao', 'valor0a18anos', 'valor19a23anos', 'valor24a28anos', 'valor29a33anos', 'valor34a38anos', 'valor39a43anos', 'valor44a48anos', 'valor49a53anos', 'valor54a58anos', 'valor59ouMaisAnos'];
  dataSourceOpcao = new MatTableDataSource<Opcao>();

  estado: string;
  opcaoEditando: Opcao;
  opcaoSelecionada: Opcao;
  todasAcomodacoes: Acomodacao[];
  todasTabelas: Tabela[];
  todosEstados: Estado[];
  todosProdutos: Produto[];
  todasCategorias: Categoria[];
  todasOperadoras: Operadora[];
  todasAdministradoras: Administradora[];

  tabelaAutoCompleteControl = new FormControl();
  estadoAutoCompleteControl = new FormControl();
  produtoAutoCompleteControl = new FormControl();
  operadoraAutoCompleteControl = new FormControl();
  administradoraAutoCompleteControl = new FormControl();
  tabelaFilteredOptions: Observable<Tabela[]>;
  estadoFilteredOptions: Observable<Estado[]>;
  produtoFilteredOptions: Observable<Produto[]>;
  operadoraFilteredOptions: Observable<Operadora[]>;
  administradoraFilteredOptions: Observable<Administradora[]>;

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private opcaoService: OpcaoService,
    private estadoService: EstadoService,
    private tabelaService: TabelaService,
    private operadoraService: OperadoraService,
    private categoriaService: CategoriaService,
    private acomodacaoService: AcomodacaoService,
    private administradoraService: AdministradoraService,
  ) {}

  ngOnInit(): void {
    this.iniciaAutoCompletes();
    this.categoriaService.getAllCategorias().subscribe(response => this.todasCategorias = response);
    this.acomodacaoService.getAllAcomodacoes().subscribe(response => this.todasAcomodacoes = response);
    this.carregaTabelaOpcao();
  }

  private iniciaAutoCompletes(): void {
    this.estadoAutoCompleteControl.disable();
    this.estadoFilteredOptions = this.estadoAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.estadoFilterAutoComplete(value))
    );
    this.administradoraFilteredOptions = this.administradoraAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.administradoraFilterAutoComplete(value))
    );
    this.operadoraFilteredOptions = this.operadoraAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.operadoraFilterAutoComplete(value))
    );
    this.tabelaFilteredOptions = this.tabelaAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.tabelaFilterAutoComplete(value))
    );
    this.produtoFilteredOptions = this.produtoAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.produtoFilterAutoComplete(value))
    );
  }

  private carregaTabelaOpcao(): void {
    this.opcaoService.getAllOpcoes().subscribe(response => {
      this.dataSourceOpcao = new MatTableDataSource<Opcao>(response);
      this.dataSourceOpcao.sort = this.sortOpcao;
      this.dataSourceOpcao.paginator = this.paginatorOpcao;
      this.dataSourceOpcao.sortingDataAccessor = (opcao, property) => {
        switch (property) {
          default:
            return opcao[property];
        }
      };
    });
  }

  private carregaEstadoPorCategoria(categoria: Categoria): void {
    if (this.adicionandoOpcao() || this.editandoOpcao()) {
      this.estadoAutoCompleteControl.setValue('');
      this.administradoraAutoCompleteControl.setValue('');
      this.categoriaService.getEstadosByCategoria(categoria).subscribe(response => {
        this.todosEstados = response;
        setTimeout(() => this.estadoAutoCompleteControl.setValue(''));
      });
    }
  }

  private carregaAdministradoraPorEstadoAndCategoria(): void {
    if (this.adicionandoOpcao() || this.editandoOpcao()) {
      const estado = this.estadoAutoCompleteControl.value;
      if (estado.sigla && this.opcaoEditando.categoria) {
        this.administradoraAutoCompleteControl.setValue('');
        this.estadoService.getAdministradorasByEstadoAndCategoria(estado, this.opcaoEditando.categoria).subscribe(response => {
          this.todasAdministradoras = response;
          setTimeout(() => this.administradoraAutoCompleteControl.setValue(''));
        });
      }
    }
  }

  private carregaOperadoraPorEstadoAndCategoriaAndAdministradoraAndMEI(contemplaMEI: boolean): void {
    this.opcaoEditando.mei = contemplaMEI;
    this.carregaOperadoraPorAdministradoraAndEstadoAndCategoria();
  }

  private carregaOperadoraPorAdministradoraAndEstadoAndCategoria(): void {
    if (this.adicionandoOpcao() || this.editandoOpcao()) {
      const estado = this.estadoAutoCompleteControl.value;
      const administradora = this.administradoraAutoCompleteControl.value;
      if (estado.sigla && administradora.id && this.opcaoEditando.categoria) {
        this.operadoraAutoCompleteControl.setValue('');
        this.administradoraService.getOperadorasByAdministradoraAndEstadoAndCategoriaAndMEI(administradora, estado, this.opcaoEditando.categoria, this.opcaoEditando.mei).subscribe(response => {
          this.todasOperadoras = response;
          setTimeout(() => this.operadoraAutoCompleteControl.setValue(''));
        });
      }
    }
  }

  private carregaTabelaPorOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI(): void {
    if (this.adicionandoOpcao() || this.editandoOpcao()) {
      const estado = this.estadoAutoCompleteControl.value;
      const administradora = this.administradoraAutoCompleteControl.value;
      const operadora = this.operadoraAutoCompleteControl.value;
      if (operadora.id && estado.sigla && administradora.id && this.opcaoEditando.categoria) {
        this.tabelaAutoCompleteControl.setValue('');
        this.operadoraService.getTabelasByOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI(operadora, administradora, estado, this.opcaoEditando.categoria, this.opcaoEditando.mei).subscribe(response => {
          this.todasTabelas = response;
          setTimeout(() => this.tabelaAutoCompleteControl.setValue(''));
        });
      }
    }
  }

  private carregaProdutosPorTabelaAndOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI(): void {
    if (this.adicionandoOpcao() || this.editandoOpcao()) {
      const estado = this.estadoAutoCompleteControl.value;
      const administradora = this.administradoraAutoCompleteControl.value;
      const operadora = this.operadoraAutoCompleteControl.value;
      const tabela = this.tabelaAutoCompleteControl.value;
      if (tabela.id && operadora.id && estado.sigla && administradora.id && this.opcaoEditando.categoria) {
        this.produtoAutoCompleteControl.setValue('');
        this.tabelaService.getProdutosByTabelaAndOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI(tabela, operadora, administradora, estado, this.opcaoEditando.categoria, this.opcaoEditando.mei).subscribe(response => {
          this.todosProdutos = response;
          setTimeout(() => this.produtoAutoCompleteControl.setValue(''));
        });
      }
    }
  }

  selecionaOpcao(opcao: Opcao): void {
    this.estado = null;
    this.opcaoSelecionada = opcao;
    this.opcaoEditando = {...opcao};
    this.opcaoEditando.categoria = opcao.tabela.categoria;
    this.tabelaAutoCompleteControl.disable();
    this.estadoAutoCompleteControl.disable();
    this.produtoAutoCompleteControl.disable();
    this.operadoraAutoCompleteControl.disable();
    this.administradoraAutoCompleteControl.disable();
    this.tabelaAutoCompleteControl.setValue(this.opcaoEditando.tabela);
    this.produtoAutoCompleteControl.setValue(this.opcaoEditando.produto)
    this.estadoAutoCompleteControl.setValue(this.opcaoEditando.tabela.estado);
    this.operadoraAutoCompleteControl.setValue(this.opcaoEditando.tabela.operadora);
    this.administradoraAutoCompleteControl.setValue(this.opcaoEditando.tabela.administradora);
  }

  editarOpcao(): void {
    this.estado = 'editandoOpcao';
    this.tabelaAutoCompleteControl.enable();
    this.estadoAutoCompleteControl.enable();
    this.produtoAutoCompleteControl.enable();
    this.operadoraAutoCompleteControl.enable();
    this.administradoraAutoCompleteControl.enable();
  }

  cancelarEdicao(): void {
    this.estado = null;
    this.opcaoEditando = {...this.opcaoSelecionada};
    this.opcaoEditando.categoria = this.opcaoEditando.tabela.categoria;
    this.tabelaAutoCompleteControl.disable();
    this.estadoAutoCompleteControl.disable();
    this.produtoAutoCompleteControl.disable();
    this.operadoraAutoCompleteControl.disable();
    this.administradoraAutoCompleteControl.disable();
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.opcaoSelecionada = null;
    this.tabelaAutoCompleteControl.disable();
    this.estadoAutoCompleteControl.disable();
    this.produtoAutoCompleteControl.disable();
    this.operadoraAutoCompleteControl.disable();
    this.administradoraAutoCompleteControl.disable();
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.opcaoSelecionada = new Opcao();
    this.tabelaAutoCompleteControl.enable();
    this.estadoAutoCompleteControl.enable();
    this.produtoAutoCompleteControl.enable();
    this.operadoraAutoCompleteControl.enable();
    this.administradoraAutoCompleteControl.enable();
    this.tabelaAutoCompleteControl.setValue(new Reajuste());
    this.estadoAutoCompleteControl.setValue(new Estado());
    this.produtoAutoCompleteControl.setValue(new Produto());
    this.operadoraAutoCompleteControl.setValue(new Operadora());
    this.administradoraAutoCompleteControl.setValue(new Administradora());
    this.opcaoEditando = this.opcaoSelecionada;
  }

  visualizar(): void {
    this.estado = null;
    this.tabelaAutoCompleteControl.disable();
    this.estadoAutoCompleteControl.disable();
    this.produtoAutoCompleteControl.disable();
    this.operadoraAutoCompleteControl.disable();
    this.administradoraAutoCompleteControl.disable();
  }

  limpar(): void {
    this.estado = null;
    this.opcaoEditando = null;
    this.opcaoSelecionada = null;
    this.tabelaAutoCompleteControl.disable();
    this.estadoAutoCompleteControl.disable();
    this.produtoAutoCompleteControl.disable();
    this.operadoraAutoCompleteControl.disable();
    this.administradoraAutoCompleteControl.disable();
  }

  editandoOpcao(): boolean {
    return this.estado === 'editandoOpcao';
  }

  adicionandoOpcao(): boolean {
    return this.estado === 'adicionando';
  }

  salvarNovaOpcao(): void {
    this.opcaoEditando.tabela = this.tabelaAutoCompleteControl.value;
    this.opcaoEditando.produto = this.produtoAutoCompleteControl.value;
    this.opcaoService.adicionarOpcao(this.opcaoEditando).subscribe(response => {
      this.snackBar.openSnackBar('Opcao adicionado com sucesso!');
      this.limpar();
      this.carregaTabelaOpcao();
    });
  }

  atualizarOpcao(): void {
    this.opcaoEditando.tabela = this.tabelaAutoCompleteControl.value;
    this.opcaoEditando.produto = this.produtoAutoCompleteControl.value;
    this.opcaoService.editarOpcao(this.opcaoEditando).subscribe(response => {
      this.snackBar.openSnackBar('Opcao atualizado com sucesso!');
      this.visualizar();
      this.carregaTabelaOpcao();
      this.opcaoSelecionada = response;
    });
  }

  removerOpcao(): void {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Tem certeza?',
        descricao: 'Deseja remover a opcao ?',
        confirma: 'Sim',
        cancela: 'Nao',
      }
    }).afterClosed().subscribe(confirmacao => {
      if (confirmacao) {
        this.opcaoService.excluirOpcao(this.opcaoSelecionada).subscribe(response => {
          this.snackBar.openSnackBar('Opcao apagada com sucesso!');
          this.limpar();
          this.carregaTabelaOpcao();
        });
      }
    });
  }

  private produtoFilterAutoComplete(value: string): Produto[] {
    const filterValue = value?.toLowerCase();
    return this.todosProdutos?.filter(produto => produto.nome.toLowerCase().includes(filterValue));
  }

  private tabelaFilterAutoComplete(value: string): Tabela[] {
    const filterValue = value?.toLowerCase();
    return this.todasTabelas?.filter(tabela => tabela.nome.toLowerCase().includes(filterValue));
  }

  private estadoFilterAutoComplete(value: string): Estado[] {
    const filterValue = value?.toLowerCase();
    return this.todosEstados?.filter(estado => estado.nome.toLowerCase().includes(filterValue) || estado.sigla.toLowerCase().includes(filterValue));
  }

  private administradoraFilterAutoComplete(value: string): Administradora[] {
    const filterValue = value?.toLowerCase();
    return this.todasAdministradoras?.filter(adminstradora => adminstradora.nome.toLowerCase().includes(filterValue));
  }

  private operadoraFilterAutoComplete(value: string): Operadora[] {
    const filterValue = value?.toLowerCase();
    return this.todasOperadoras?.filter(operadora => operadora.nome.toLowerCase().includes(filterValue));
  }

  produtoDisplayFn(produto: Produto): string {
    return produto && produto.nome ? produto.nome : '';
  }

  tabelaDisplayFn(tabela: Tabela): string {
    return tabela && tabela.nome ? tabela.nome : '';
  }

  estadoDisplayFn(estado: Estado): string {
    return estado && estado.nome ? estado.nome : '';
  }

  administradoraDisplayFn(administradora: Administradora): string {
    return administradora && administradora.nome ? administradora.nome : '';
  }

  operadoraDisplayFn(operadora: Operadora): string {
    return operadora && operadora.nome ? operadora.nome : '';
  }

}
