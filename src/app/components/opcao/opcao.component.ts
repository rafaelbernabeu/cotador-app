import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {OpcaoService} from '../../services/opcao/opcao.service';
import {DialogComponent} from '../dialog/dialog.component';
import {Opcao} from '../../services/opcao/opcao';
import {Produto} from '../../services/produto/produto';
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
import {EntidadeService} from "../../services/entidade/entidade.service";
import {Profissao} from "../../services/profissao/profissao";
import {ProfissaoService} from "../../services/profissao/profissao.service";
import {FiltroOpcao} from "../../services/opcao/filtro-opcao";
import {Abrangencia} from "../../services/abrangencia/abrangencia";
import {Reajuste} from "../../services/reajuste/reajuste";

@Component({
  selector: 'app-opcao',
  templateUrl: './opcao.component.html',
  styleUrls: ['./opcao.component.scss']
})
export class OpcaoComponent implements OnInit {

  @ViewChild(MatSort) sortOpcao: MatSort;
  @ViewChild(MatPaginator) paginatorOpcao: MatPaginator;

  displayedColumns: string[] = ['id', 'estado', 'tabela', 'idadeMin', 'idadeMax', 'qtdMinVidas', 'qtdMinTitulares', 'acomodacao', 'coparticipacao', 'administradora', 'operadora', 'produto', 'abrangencia', 'valor0a18anos', 'valor19a23anos', 'valor24a28anos', 'valor29a33anos', 'valor34a38anos', 'valor39a43anos', 'valor44a48anos', 'valor49a53anos', 'valor54a58anos', 'valor59ouMaisAnos', 'reajuste'];
  dataSourceOpcao = new MatTableDataSource<Opcao>();

  estado: string;
  opcaoEditando: Opcao;
  opcaoSelecionada: Opcao;
  filtroOpcao: FiltroOpcao;
  todasOpcoes: Opcao[];
  todasTabelas: Tabela[];
  todosEstados: Estado[];
  todosProdutos: Produto[];
  todosReajustes: Reajuste[];
  todasProfissoes: Profissao[];
  todasCategorias: Categoria[];
  todasOperadoras: Operadora[];
  todasAcomodacoes: Acomodacao[];
  todasAbrangencias: Abrangencia[];
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
    @Inject('Window') public window: Window,

    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private opcaoService: OpcaoService,
    private estadoService: EstadoService,
    private tabelaService: TabelaService,
    private entidadeService: EntidadeService,
    private operadoraService: OperadoraService,
    private profissaoService: ProfissaoService,
    private categoriaService: CategoriaService,
    private acomodacaoService: AcomodacaoService,
    private administradoraService: AdministradoraService,
  ) {}

  ngOnInit(): void {
    this.categoriaService.getAllCategorias().subscribe(response => this.todasCategorias = response);
    this.acomodacaoService.getAllAcomodacoes().subscribe(response => this.todasAcomodacoes = response);
    this.profissaoService.getAllProfissoes().subscribe(response => {
      this.todasProfissoes = response;
      this.displayedColumns.push(...this.todasProfissoes.map(p => p.nome));
    })
    this.iniciaAutoCompletes();
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
      this.todasOpcoes = response;
      this.configuraTabelaOpcao(this.todasOpcoes);
    });
  }

  private configuraTabelaOpcao(opcoes: Opcao[]) {
    this.dataSourceOpcao = new MatTableDataSource<Opcao>(opcoes);
    this.dataSourceOpcao.sort = this.sortOpcao;
    this.dataSourceOpcao.paginator = this.paginatorOpcao;
    this.dataSourceOpcao.sortingDataAccessor = (opcao, property) => {
      if (this.todasProfissoes.filter(p => p.nome === property).length > 0) {
        return this.getNomesEntidadesPorProfissao(opcao, property);
      }
      switch (property) {
        case 'estado':
          return opcao.tabela.estado.sigla;
        case 'tabela':
          return opcao.tabela.nome;
        case 'idadeMin':
          return opcao.tabela.idadeMinima;
        case 'idadeMax':
          return opcao.tabela.idadeMinima;
        case 'qtdMinVidas':
          return opcao.tabela.qtdMinVidas;
        case 'qtdMinTitulares':
          return opcao.tabela.qtdMinTitulares;
        case 'administradora':
          return opcao.tabela.administradora?.nome;
        case 'operadora':
          return opcao.tabela.operadora.nome;
        case 'produto':
          return opcao.produto.nome;
        case 'abrangencia':
          return opcao.produto.abrangencia;
        case 'reajuste':
          return opcao.tabela.reajuste;
        default:
          return opcao[property];
      }
    };
  }

  private preparaAutoCompletesParaEdicao(): void {
    this.carregaEstadoPorCategoria();
    if (this.isCategoriaAdesao()) {
      this.carregaAdministradoraPorEstadoAndCategoria();
      this.carregaOperadoraPorAdministradoraAndEstadoAndCategoria();
      this.carregaTabelaPorOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI()
      this.carregaProdutosPorTabelaAndOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI()
    } else if (this.isCategoriaEmpresarial()) {
      this.carregaOperadoraPorEstadoAndCategoria();
      this.carregaTabelaPorOperadoraAndEstadoAndCategoriaAndMEI()
      this.carregaProdutosPorTabelaAndOperadoraAndEstadoAndCategoriaAndMEI()
    }
  }

  private modelChangeCategoria(categoria: Categoria): void {
    this.opcaoEditando.categoria = categoria;
    if (this.adicionandoOpcao() || this.editandoOpcao()) {
      if (this.isCategoriaEmpresarial()) {
        this.administradoraAutoCompleteControl.setValue('');
      }
      this.carregaEstadoPorCategoria();
    }
  }

  private carregaEstadoPorCategoria(): void {
    this.categoriaService.getEstadosByCategoria(this.opcaoEditando.categoria).subscribe(response => {
      this.todosEstados = response;
      if (this.editandoOpcao() || this.adicionandoOpcao()) {
        this.estadoAutoCompleteControl.enable();
      }
      let novoEstadoSelecionado: any = this.estadoAutoCompleteControl.value;
      if (this.todosEstados.filter(e => e.nome === novoEstadoSelecionado?.nome).length === 0) {
        novoEstadoSelecionado = '';
        this.administradoraAutoCompleteControl.disable()
        this.administradoraAutoCompleteControl.setValue('');
        this.operadoraAutoCompleteControl.disable()
        this.operadoraAutoCompleteControl.setValue('');
        this.tabelaAutoCompleteControl.disable()
        this.tabelaAutoCompleteControl.setValue('');
        this.produtoAutoCompleteControl.disable()
        this.produtoAutoCompleteControl.setValue('');
      }
      setTimeout(() => this.estadoAutoCompleteControl.setValue(novoEstadoSelecionado));
    });
  }

  private modelChangeEstado(): void {
    if (this.adicionandoOpcao() || this.editandoOpcao()) {
      if (this.isCategoriaAdesao()) {
        this.carregaAdministradoraPorEstadoAndCategoria();
      } else if (this.isCategoriaEmpresarial()) {
        this.carregaOperadoraPorEstadoAndCategoria();
      }
    }
  }

  private carregaAdministradoraPorEstadoAndCategoria(): void {
    const estado = this.estadoAutoCompleteControl.value;
    if (estado.sigla && this.opcaoEditando.categoria) {
      this.estadoService.getAdministradorasByEstadoAndCategoria(estado, this.opcaoEditando.categoria).subscribe(response => {
        this.todasAdministradoras = response;
        if (this.editandoOpcao() || this.adicionandoOpcao()) {
          this.administradoraAutoCompleteControl.enable();
        }
        let novaAdministradoraSelecionada: any = this.administradoraAutoCompleteControl.value;
        if (this.todasAdministradoras.filter(a => a.nome === novaAdministradoraSelecionada?.nome).length === 0) {
          novaAdministradoraSelecionada = '';
          this.operadoraAutoCompleteControl.disable()
          this.operadoraAutoCompleteControl.setValue('');
          this.tabelaAutoCompleteControl.disable()
          this.tabelaAutoCompleteControl.setValue('');
          this.produtoAutoCompleteControl.disable()
          this.produtoAutoCompleteControl.setValue('');
        }
        setTimeout(() => this.administradoraAutoCompleteControl.setValue(novaAdministradoraSelecionada));
      });
    }
  }

  private modelChangeMEI(contemplaMEI: boolean): void {
    this.opcaoEditando.mei = contemplaMEI;
    if (this.adicionandoOpcao() || this.editandoOpcao()) {
      if (this.isCategoriaAdesao()) {
        this.carregaOperadoraPorAdministradoraAndEstadoAndCategoria();
      } else if (this.isCategoriaEmpresarial()) {
        this.carregaOperadoraPorEstadoAndCategoria();
      }
    }
  }

  private modelChangeAdministradora(): void {
    if (this.adicionandoOpcao() || this.editandoOpcao()) {
      this.carregaOperadoraPorAdministradoraAndEstadoAndCategoria();
    }
  }

  private carregaOperadoraPorAdministradoraAndEstadoAndCategoria(): void {
    const estado = this.estadoAutoCompleteControl.value;
    const administradora = this.administradoraAutoCompleteControl.value;
    if (estado.sigla && administradora.id && this.opcaoEditando.categoria) {
      this.administradoraService.getOperadorasByAdministradoraAndEstadoAndCategoriaAndMEI(administradora, estado, this.opcaoEditando.categoria, this.opcaoEditando.mei).subscribe(response => {
        this.todasOperadoras = response;
        if (this.editandoOpcao() || this.adicionandoOpcao()) {
          this.operadoraAutoCompleteControl.enable();
        }
        let novaOperadoraSelecionada: any = this.operadoraAutoCompleteControl.value;
        if (this.todasOperadoras.filter(o => o.nome === novaOperadoraSelecionada?.nome).length === 0) {
          novaOperadoraSelecionada = '';
          this.tabelaAutoCompleteControl.disable()
          this.tabelaAutoCompleteControl.setValue('');
          this.produtoAutoCompleteControl.disable()
          this.produtoAutoCompleteControl.setValue('');
        }
        setTimeout(() => this.operadoraAutoCompleteControl.setValue(novaOperadoraSelecionada));
      });
    }
  }

  private carregaOperadoraPorEstadoAndCategoria(): void {
    const estado = this.estadoAutoCompleteControl.value;
    if (estado.sigla && this.opcaoEditando.categoria) {
      this.estadoService.getOperadorasByEstadoAndCategoriaAndMEI(estado, this.opcaoEditando.categoria, this.opcaoEditando.mei).subscribe(response => {
        this.todasOperadoras = response;
        if (this.editandoOpcao() || this.adicionandoOpcao()) {
          this.operadoraAutoCompleteControl.enable();
        }
        let novaOperadoraSelecionada: any = this.operadoraAutoCompleteControl.value;
        if (this.todasOperadoras.filter(o => o.nome === novaOperadoraSelecionada?.nome).length === 0) {
          novaOperadoraSelecionada = '';
          this.tabelaAutoCompleteControl.disable()
          this.tabelaAutoCompleteControl.setValue('');
          this.produtoAutoCompleteControl.disable()
          this.produtoAutoCompleteControl.setValue('');
        }
        setTimeout(() => this.operadoraAutoCompleteControl.setValue(novaOperadoraSelecionada));
      });
    }
  }

  private modelChangeOperadora(): void {
    if (this.adicionandoOpcao() || this.editandoOpcao()) {
      if (this.isCategoriaAdesao()) {
        this.carregaTabelaPorOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI();
      } else if (this.isCategoriaEmpresarial()) {
        this.carregaTabelaPorOperadoraAndEstadoAndCategoriaAndMEI();
      }
    }
  }

  private carregaTabelaPorOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI(): void {
    const estado = this.estadoAutoCompleteControl.value;
    const administradora = this.administradoraAutoCompleteControl.value;
    const operadora = this.operadoraAutoCompleteControl.value;
    if (operadora.id && estado.sigla && administradora.id && this.opcaoEditando.categoria) {
      this.operadoraService.getTabelasByOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI(operadora, administradora, estado, this.opcaoEditando.categoria, this.opcaoEditando.mei).subscribe(response => {
        this.todasTabelas = response;
        if (this.editandoOpcao() || this.adicionandoOpcao()) {
          this.tabelaAutoCompleteControl.enable();
        }
        let novaTabelaSelecionada: any = this.tabelaAutoCompleteControl.value;
        if (this.todasTabelas.filter(t => t.nome === novaTabelaSelecionada?.nome).length === 0) {
          novaTabelaSelecionada = '';
          this.produtoAutoCompleteControl.disable();
          this.produtoAutoCompleteControl.setValue('');
        }
        setTimeout(() => this.tabelaAutoCompleteControl.setValue(novaTabelaSelecionada));
      });
    }
  }

  private carregaTabelaPorOperadoraAndEstadoAndCategoriaAndMEI(): void {
    const estado = this.estadoAutoCompleteControl.value;
    const operadora = this.operadoraAutoCompleteControl.value;
    if (operadora.id && estado.sigla && this.opcaoEditando.categoria) {
      this.operadoraService.getTabelasByOperadoraAndEstadoAndCategoriaAndMEI(operadora, estado, this.opcaoEditando.categoria, this.opcaoEditando.mei).subscribe(response => {
        this.todasTabelas = response;
        if (this.editandoOpcao() || this.adicionandoOpcao()) {
          this.tabelaAutoCompleteControl.enable();
        }
        let novaTabelaSelecionada: any = this.tabelaAutoCompleteControl.value;
        if (this.todasTabelas.filter(t => t.nome === novaTabelaSelecionada?.nome).length === 0) {
          novaTabelaSelecionada = '';
          this.produtoAutoCompleteControl.disable();
          this.produtoAutoCompleteControl.setValue('');
        }
        setTimeout(() => this.tabelaAutoCompleteControl.setValue(novaTabelaSelecionada));
      });
    }
  }

  private modelChangeTabela(): void {
    if (this.adicionandoOpcao() || this.editandoOpcao()) {
      if (this.isCategoriaAdesao()) {
        this.carregaProdutosPorTabelaAndOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI();
      } else if (this.isCategoriaEmpresarial()) {
        this.carregaProdutosPorTabelaAndOperadoraAndEstadoAndCategoriaAndMEI();
      }
    }
  }

  private carregaProdutosPorTabelaAndOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI(): void {
    const estado = this.estadoAutoCompleteControl.value;
    const administradora = this.administradoraAutoCompleteControl.value;
    const operadora = this.operadoraAutoCompleteControl.value;
    const tabela = this.tabelaAutoCompleteControl.value;
    if (tabela.id && operadora.id && estado.sigla && administradora.id && this.opcaoEditando.categoria) {
      this.tabelaService.getProdutosByTabelaAndOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI(tabela, operadora, administradora, estado, this.opcaoEditando.categoria, this.opcaoEditando.mei).subscribe(response => {
        this.todosProdutos = response;
        if (this.editandoOpcao() || this.adicionandoOpcao()) {
          this.produtoAutoCompleteControl.enable();
        }
        let novoProdutoSelecionado: any = this.produtoAutoCompleteControl.value;
        if (this.todosProdutos.filter(o => o.nome === novoProdutoSelecionado?.nome).length === 0) {
          novoProdutoSelecionado = '';
        }
        setTimeout(() => this.produtoAutoCompleteControl.setValue(novoProdutoSelecionado));
      });
    }
  }

  private carregaProdutosPorTabelaAndOperadoraAndEstadoAndCategoriaAndMEI(): void {
    const estado = this.estadoAutoCompleteControl.value;
    const operadora = this.operadoraAutoCompleteControl.value;
    const tabela = this.tabelaAutoCompleteControl.value;
    if (tabela.id && operadora.id && estado.sigla && this.opcaoEditando.categoria) {
      this.tabelaService.getProdutosByTabelaAndOperadoraAndEstadoAndCategoriaAndMEI(tabela, operadora, estado, this.opcaoEditando.categoria, this.opcaoEditando.mei).subscribe(response => {
        this.todosProdutos = response;
        if (this.editandoOpcao() || this.adicionandoOpcao()) {
          this.produtoAutoCompleteControl.enable();
        }
        let novoProdutoSelecionado: any = this.produtoAutoCompleteControl.value;
        if (this.todosProdutos.filter(o => o.nome === novoProdutoSelecionado?.nome).length === 0) {
          novoProdutoSelecionado = '';
        }
        setTimeout(() => this.produtoAutoCompleteControl.setValue(novoProdutoSelecionado));
      });
    }
  }

  selecionaOpcao(opcao: Opcao): void {
    this.estado = null;
    this.opcaoSelecionada = opcao;
    this.opcaoEditando = {...opcao};
    this.opcaoEditando.mei = opcao.tabela.contemplaMEI;
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
    this.administradoraAutoCompleteControl.setValue(this.opcaoEditando.tabela.administradora ? this.opcaoEditando.tabela.administradora : '');
    this.preparaAutoCompletesParaEdicao();
    this.editarOpcao();
  }

  copiarOpcao(): void {
    this.editarOpcao();
    this.opcaoEditando.id = null;
    this.estado = 'adicionando';
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
    this.opcaoEditando.mei = this.opcaoEditando.tabela.contemplaMEI;
    this.opcaoEditando.categoria = this.opcaoEditando.tabela.categoria;
    this.tabelaAutoCompleteControl.setValue(this.opcaoEditando.tabela);
    this.estadoAutoCompleteControl.setValue(this.opcaoEditando.tabela.estado);
    this.produtoAutoCompleteControl.setValue(this.opcaoEditando.produto);
    this.operadoraAutoCompleteControl.setValue(this.opcaoEditando.tabela.operadora);
    this.administradoraAutoCompleteControl.setValue(this.opcaoEditando.tabela.administradora);
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
    this.opcaoEditando = this.opcaoSelecionada;
    this.tabelaAutoCompleteControl.disable();
    this.estadoAutoCompleteControl.disable();
    this.produtoAutoCompleteControl.disable();
    this.operadoraAutoCompleteControl.disable();
    this.administradoraAutoCompleteControl.disable();
    this.tabelaAutoCompleteControl.setValue('');
    this.estadoAutoCompleteControl.setValue('');
    this.produtoAutoCompleteControl.setValue('');
    this.operadoraAutoCompleteControl.setValue('');
    this.administradoraAutoCompleteControl.setValue('');
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

  getNomesEntidadesPorProfissao(opcao: Opcao, profissao: string): string {
    let nomes = opcao.tabela.entidades.filter(e => e.profissoes.filter(p => p.nome === profissao).length > 0).map(e => e.nome).join(' / ');
    return nomes ? nomes : '--';
  }

  isCategoriaEmpresarial(): boolean {
    return this.opcaoEditando.categoria === 'Empresarial';
  }

  isCategoriaAdesao(): boolean {
    return this.opcaoEditando.categoria === 'Adesão';
  }

  filtrandoOpcao(): boolean {
    return this.estado === 'filtrando';
  }

  filtraOpcao() {
    setTimeout(() => {
      let opcoesFiltradas = this.todasOpcoes;

      if (this.filtroOpcao.estados.length > 0) {
        opcoesFiltradas = opcoesFiltradas.filter(op => this.filtroOpcao.estados.filter(e => e.sigla === op.tabela.estado.sigla).length > 0);
      }

      if (this.filtroOpcao.tabelas.length > 0) {
        opcoesFiltradas = opcoesFiltradas.filter(op => this.filtroOpcao.tabelas.filter(t => t.id === op.tabela.id).length > 0);
      }

      if (this.filtroOpcao.acomodacao) {
        opcoesFiltradas = opcoesFiltradas.filter(op => op.acomodacao === this.filtroOpcao.acomodacao);
      }

      if (this.filtroOpcao.coparticipacao != null) {
        opcoesFiltradas = opcoesFiltradas.filter(op => op.coparticipacao === this.filtroOpcao.coparticipacao);
      }

      if (this.filtroOpcao.administradoras.length > 0) {
        opcoesFiltradas = opcoesFiltradas.filter(op => this.filtroOpcao.administradoras.filter(adm => op.tabela.administradora && adm.id === op.tabela.administradora.id).length > 0);
      }

      if (this.filtroOpcao.operadoras.length > 0) {
        opcoesFiltradas = opcoesFiltradas.filter(op => this.filtroOpcao.operadoras.filter(o => o.id === op.tabela.operadora.id).length > 0);
      }

      if (this.filtroOpcao.produtos.length > 0) {
        opcoesFiltradas = opcoesFiltradas.filter(op => this.filtroOpcao.produtos.filter(p => p.id === op.produto.id).length > 0);
      }

      if (this.filtroOpcao.profissoes.length > 0) {
        opcoesFiltradas = opcoesFiltradas.filter(op => op.tabela.entidades.filter(e => e.profissoes.filter(p => this.filtroOpcao.profissoes.filter(fp => p.id === fp.id).length > 0).length > 0).length > 0);
      }

      if (this.filtroOpcao.abrangencia) {
        opcoesFiltradas = opcoesFiltradas.filter(op => op.produto.abrangencia === this.filtroOpcao.abrangencia);
      }

      if (this.filtroOpcao.reajuste) {
        opcoesFiltradas = opcoesFiltradas.filter(op => op.tabela.reajuste === this.filtroOpcao.reajuste);
      }

      if (this.filtroOpcao.tipoFiltro) {

        opcoesFiltradas = this.filtraOpcaoPorReembolso(opcoesFiltradas, this.filtroOpcao.tipoFiltro);
        opcoesFiltradas = this.filtraOpcaoPorIdadeMin(opcoesFiltradas, this.filtroOpcao.tipoFiltro);
        opcoesFiltradas = this.filtraOpcaoPorIdadeMax(opcoesFiltradas, this.filtroOpcao.tipoFiltro);
        opcoesFiltradas = this.filtraOpcaoPorQtdMinVidas(opcoesFiltradas, this.filtroOpcao.tipoFiltro);
        opcoesFiltradas = this.filtraOpcaoPorQtdMinTitulares(opcoesFiltradas, this.filtroOpcao.tipoFiltro);

      }

      this.configuraTabelaOpcao(opcoesFiltradas);

    });
  }

  filtrar(): void {
    this.todasTabelas = this.todasOpcoes.map(op => op.tabela).filter(this.filtraDuplicadasId);
    this.todosProdutos = this.todasOpcoes.map(op => op.produto).filter(this.filtraDuplicadasId);
    this.todosEstados = this.todasOpcoes.map(op => op.tabela.estado).filter(this.filtraDuplicadasNome);
    this.todasOperadoras = this.todasOpcoes.map(op => op.tabela.operadora).filter(this.filtraDuplicadasId);
    this.todosReajustes = this.todasOpcoes.map(op => op.tabela.reajuste).filter(this.filtraDuplicadasString);
    this.todasAdministradoras = this.todasOpcoes.map(op => op.tabela.administradora).filter(this.filtraDuplicadasId);
    this.todasAbrangencias = this.todasOpcoes.map(op => op.produto.abrangencia).filter(this.filtraDuplicadasString);

    this.estado = 'filtrando';
    this.opcaoSelecionada = null;
    this.filtroOpcao = new FiltroOpcao();
  }

  private filtraOpcaoPorReembolso(opcoesFiltradas: Opcao[], tipoFiltro: string) {
    if (this.filtroOpcao.reembolso > 0) {
      switch (tipoFiltro) {
        case '<':
          return opcoesFiltradas.filter(op => op.produto.reembolso <= this.filtroOpcao.reembolso);
        case '=':
          return opcoesFiltradas.filter(op => op.produto.reembolso === this.filtroOpcao.reembolso);
        case '>':
          return opcoesFiltradas.filter(op => op.produto.reembolso >= this.filtroOpcao.reembolso);
      }
    }
    return opcoesFiltradas;
  }

  private filtraOpcaoPorIdadeMin(opcoesFiltradas: Opcao[], tipoFiltro: string) {
    if (this.filtroOpcao.idadeMin > 0) {
      switch (tipoFiltro) {
        case '<':
          return opcoesFiltradas.filter(op => op.tabela.idadeMinima <= this.filtroOpcao.idadeMin);
        case '=':
          return opcoesFiltradas.filter(op => op.tabela.idadeMinima === this.filtroOpcao.idadeMin);
        case '>':
          return opcoesFiltradas.filter(op => op.tabela.idadeMinima >= this.filtroOpcao.idadeMin);
      }
    }
    return opcoesFiltradas;
  }

  private filtraOpcaoPorIdadeMax(opcoesFiltradas: Opcao[], tipoFiltro: string) {
    if (this.filtroOpcao.idadeMax > 0) {
      switch (tipoFiltro) {
        case '<':
          return opcoesFiltradas.filter(op => op.tabela.idadeMaxima <= this.filtroOpcao.idadeMax);
        case '=':
          return opcoesFiltradas.filter(op => op.tabela.idadeMaxima === this.filtroOpcao.idadeMax);
        case '>':
          return opcoesFiltradas.filter(op => op.tabela.idadeMaxima >= this.filtroOpcao.idadeMax);
      }
    }
    return opcoesFiltradas;
  }

  private filtraOpcaoPorQtdMinVidas(opcoesFiltradas: Opcao[], tipoFiltro: string) {
    if (this.filtroOpcao.qtdMinVidas > 0) {
      switch (tipoFiltro) {
        case '<':
          return opcoesFiltradas.filter(op => op.tabela.qtdMinVidas <= this.filtroOpcao.qtdMinVidas);
        case '=':
          return opcoesFiltradas.filter(op => op.tabela.qtdMinVidas === this.filtroOpcao.qtdMinVidas);
        case '>':
          return opcoesFiltradas.filter(op => op.tabela.qtdMinVidas >= this.filtroOpcao.qtdMinVidas);
      }
    }
    return opcoesFiltradas;
  }

  private filtraOpcaoPorQtdMinTitulares(produtosFiltrados: Opcao[], tipoFiltro: string) {
    if (this.filtroOpcao.qtdMinTitulares > 0) {
      switch (tipoFiltro) {
        case '<':
          return produtosFiltrados.filter(op => op.tabela.qtdMinTitulares <= this.filtroOpcao.qtdMinTitulares);
        case '=':
          return produtosFiltrados.filter(op => op.tabela.qtdMinTitulares === this.filtroOpcao.qtdMinTitulares);
        case '>':
          return produtosFiltrados.filter(op => op.tabela.qtdMinTitulares >= this.filtroOpcao.qtdMinTitulares);
      }
    }
    return produtosFiltrados;
  }

  private filtraDuplicadasId(value: { id }, index, self: { id }[]): boolean {
    const searchElement: {id} = self.filter(item => item.id === value.id)[0];
    return self.indexOf(searchElement) === index;
  }

  private filtraDuplicadasNome(value: { nome }, index, self: { nome }[]): boolean {
    const searchElement = self.filter(item => item.nome === value.nome)[0];
    return self.indexOf(searchElement) === index;
  }

  private filtraDuplicadasString(value: string, index, self: string[]): boolean {
    const searchElement = self.filter(item => item === value)[0];
    return self.indexOf(searchElement) === index;
  }

  cancelarFiltro(): void {
    this.cancelarAdicao();
    this.configuraTabelaOpcao(this.todasOpcoes);
  }

}
