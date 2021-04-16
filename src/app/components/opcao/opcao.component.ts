import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
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
import {FormControl, NgForm, Validators} from '@angular/forms';
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
import {UtilService} from "../../services/util/util.service";
import {ReajusteService} from "../../services/reajuste/reajuste.service";

@Component({
  selector: 'app-opcao',
  templateUrl: './opcao.component.html',
  styleUrls: ['./opcao.component.scss']
})
export class OpcaoComponent implements OnInit {

  @ViewChild(NgForm) formOpcao: NgForm;
  @ViewChild(MatSort) sortOpcao: MatSort;
  @ViewChild(MatPaginator) paginatorOpcao: MatPaginator;

  @ViewChild('administradora') administradoraInput: ElementRef

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if ((this.adicionandoOpcao() || this.editandoOpcao()) && event.code === 'Enter') {
        event.preventDefault();
        this.onSubmit();
      } else if (this.opcaoSelecionada && event.code === 'KeyD') {
        event.preventDefault();
        this.copiarOpcao();
      }
    }
  }

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

  tabelaAutoCompleteControl = new FormControl(Validators.required);
  estadoAutoCompleteControl = new FormControl(Validators.required);
  produtoAutoCompleteControl = new FormControl(Validators.required);
  operadoraAutoCompleteControl = new FormControl(Validators.required);
  administradoraAutoCompleteControl = new FormControl(Validators.required);
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
    private reajusteService: ReajusteService,
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
    // if (this.isCategoriaAdesao()) {
    //   this.carregaAdministradoraPorEstadoAndCategoria();
    //   this.carregaOperadoraPorAdministradoraAndEstadoAndCategoria();
    //   this.carregaTabelaPorOperadoraAndAdministradoraAndEstadoAndCategoria()
    //   this.carregaProdutosPorTabelaAndOperadoraAndAdministradoraAndEstadoAndCategoria()
    // } else if (this.isCategoriaEmpresarial()) {
    //   this.carregaOperadoraPorEstadoAndCategoria();
    //   this.carregaTabelaPorOperadoraAndEstadoAndCategoriaAndMEI()
    //   this.carregaProdutosPorTabelaAndOperadoraAndEstadoAndCategoriaAndMEI()
    // }
  }

  private modelChangeCategoria(categoria: Categoria): void {
    this.opcaoEditando.categoria = categoria;
    this.desativaTodosAutoComplete();
    if (this.adicionandoOpcao() || this.editandoOpcao()) {
      if (this.isCategoriaEmpresarial()) {
        this.administradoraAutoCompleteControl.disable();
        this.administradoraAutoCompleteControl.setValue('');
      }
      this.carregaEstadoPorCategoria();
    }
  }

  private carregaEstadoPorCategoria(): void {
    const categoria = this.opcaoEditando.categoria;
    if (categoria) {
      this.categoriaService.getEstadosByCategoria(categoria).subscribe(response => {
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
        if (this.todasAdministradoras.filter(a => a.id === novaAdministradoraSelecionada?.id).length === 0) {
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
      this.carregaTabelaPorOperadoraAndEstadoAndCategoriaAndMEI();
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
      this.administradoraService.getOperadorasByAdministradoraAndEstadoAndCategoria(administradora, estado, this.opcaoEditando.categoria).subscribe(response => {
        this.todasOperadoras = response;
        if (this.editandoOpcao() || this.adicionandoOpcao()) {
          this.operadoraAutoCompleteControl.enable();
        }
        let novaOperadoraSelecionada: any = this.operadoraAutoCompleteControl.value;
        if (this.todasOperadoras.filter(o => o.id === novaOperadoraSelecionada?.id).length === 0) {
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
        this.carregaTabelaPorOperadoraAndAdministradoraAndEstadoAndCategoria();
      } else if (this.isCategoriaEmpresarial()) {
        this.carregaTabelaPorOperadoraAndEstadoAndCategoriaAndMEI();
      }
    }
  }

  private carregaOperadoraPorEstadoAndCategoria(): void {
    const estado = this.estadoAutoCompleteControl.value;
    if (estado.sigla && this.opcaoEditando.categoria) {
      this.estadoService.getOperadorasByEstadoAndCategoria(estado, this.opcaoEditando.categoria).subscribe(response => {
        this.todasOperadoras = response;
        if (this.editandoOpcao() || this.adicionandoOpcao()) {
          this.operadoraAutoCompleteControl.enable();
        }
        let novaOperadoraSelecionada: any = this.operadoraAutoCompleteControl.value;
        if (this.todasOperadoras.filter(o => o.id === novaOperadoraSelecionada?.id).length === 0) {
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

  private carregaTabelaPorOperadoraAndAdministradoraAndEstadoAndCategoria(): void {
    const estado = this.estadoAutoCompleteControl.value;
    const administradora = this.administradoraAutoCompleteControl.value;
    const operadora = this.operadoraAutoCompleteControl.value;
    if (operadora.id && estado.sigla && administradora.id && this.opcaoEditando.categoria) {
      this.operadoraService.getTabelasByOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI(operadora, administradora, estado, this.opcaoEditando.categoria, null).subscribe(response => {
        this.todasTabelas = response;
        if (this.editandoOpcao() || this.adicionandoOpcao()) {
          this.tabelaAutoCompleteControl.enable();
        }
        let novaTabelaSelecionada: any = this.tabelaAutoCompleteControl.value;
        if (this.todasTabelas.filter(t => t.id === novaTabelaSelecionada?.id).length === 0) {
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
      this.operadoraService.getTabelasByOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI(operadora, null, estado, this.opcaoEditando.categoria, null).subscribe(response => {
        this.todasTabelas = response;
        if (this.editandoOpcao() || this.adicionandoOpcao()) {
          this.tabelaAutoCompleteControl.enable();
        }
        let novaTabelaSelecionada: any = this.tabelaAutoCompleteControl.value;
        if (this.todasTabelas.filter(t => t.id === novaTabelaSelecionada?.id).length === 0) {
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
        this.carregaProdutosPorTabelaAndOperadoraAndAdministradoraAndEstadoAndCategoria();
      } else if (this.isCategoriaEmpresarial()) {
        this.carregaProdutosPorTabelaAndOperadoraAndEstadoAndCategoriaAndMEI();
      }
    }
  }

  private carregaProdutosPorTabelaAndOperadoraAndAdministradoraAndEstadoAndCategoria(): void {
    const estado = this.estadoAutoCompleteControl.value;
    const administradora = this.administradoraAutoCompleteControl.value;
    const operadora = this.operadoraAutoCompleteControl.value;
    const tabela = this.tabelaAutoCompleteControl.value;
    if (tabela.id && operadora.id && estado.sigla && administradora.id && this.opcaoEditando.categoria) {
      this.tabelaService.getProdutosByTabelaAndOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI(tabela, operadora, administradora, estado, this.opcaoEditando.categoria, null).subscribe(response => {
        this.todosProdutos = response;
        if (this.editandoOpcao() || this.adicionandoOpcao()) {
          this.produtoAutoCompleteControl.enable();
        }
        let novoProdutoSelecionado: any = this.produtoAutoCompleteControl.value;
        if (this.todosProdutos.filter(o => o.id === novoProdutoSelecionado?.id).length === 0) {
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
      this.tabelaService.getProdutosByTabelaAndOperadoraAndAdministradoraAndEstadoAndCategoriaAndMEI(tabela, operadora, null, estado, this.opcaoEditando.categoria, null).subscribe(response => {
        this.todosProdutos = response;
        if (this.editandoOpcao() || this.adicionandoOpcao()) {
          this.produtoAutoCompleteControl.enable();
        }
        let novoProdutoSelecionado: any = this.produtoAutoCompleteControl.value;
        if (this.todosProdutos.filter(o => o.id === novoProdutoSelecionado?.id).length === 0) {
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
    this.desativaTodosAutoComplete();
    this.tabelaAutoCompleteControl.setValue(this.opcaoEditando.tabela);
    this.produtoAutoCompleteControl.setValue(this.opcaoEditando.produto)
    this.estadoAutoCompleteControl.setValue(this.opcaoEditando.tabela.estado);
    this.operadoraAutoCompleteControl.setValue(this.opcaoEditando.tabela.operadora);
    this.administradoraAutoCompleteControl.setValue(this.opcaoEditando.tabela.administradora ? this.opcaoEditando.tabela.administradora : '');
    this.preparaAutoCompletesParaEdicao();
    this.editarOpcao();
  }

  private ativaTodosAutoComplete() {
    this.tabelaAutoCompleteControl.enable();
    this.estadoAutoCompleteControl.enable();
    this.produtoAutoCompleteControl.enable();
    this.operadoraAutoCompleteControl.enable();
    this.administradoraAutoCompleteControl.enable();
  }

  private desativaTodosAutoComplete() {
    this.tabelaAutoCompleteControl.disable();
    this.estadoAutoCompleteControl.disable();
    this.produtoAutoCompleteControl.disable();
    this.operadoraAutoCompleteControl.disable();
    this.administradoraAutoCompleteControl.disable();
  }

  copiarOpcao(): void {
    this.editarOpcao();
    this.opcaoEditando.id = null;
    this.estado = 'adicionando';
  }

  editarOpcao(): void {
    this.estado = 'editandoOpcao';
    this.ativaTodosAutoComplete();
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
    this.desativaTodosAutoComplete()
  }

  cancelarAdicao(): void {
    this.estado = null;
    this.opcaoSelecionada = null;
    this.desativaTodosAutoComplete()
  }

  adicionar(): void {
    this.estado = 'adicionando';
    this.formOpcao?.resetForm();
    this.opcaoSelecionada = new Opcao();
    this.opcaoEditando = this.opcaoSelecionada;
    this.desativaTodosAutoComplete()
    this.tabelaAutoCompleteControl.setValue('');
    this.estadoAutoCompleteControl.setValue('');
    this.produtoAutoCompleteControl.setValue('');
    this.operadoraAutoCompleteControl.setValue('');
    this.administradoraAutoCompleteControl.setValue('');
    this.tabelaAutoCompleteControl.markAsPristine();
    this.estadoAutoCompleteControl.markAsPristine();
    this.produtoAutoCompleteControl.markAsPristine();
    this.operadoraAutoCompleteControl.markAsPristine();
    this.administradoraAutoCompleteControl.markAsPristine();
    this.tabelaAutoCompleteControl.markAsUntouched();
    this.estadoAutoCompleteControl.markAsUntouched();
    this.produtoAutoCompleteControl.markAsUntouched();
    this.operadoraAutoCompleteControl.markAsUntouched();
    this.administradoraAutoCompleteControl.markAsUntouched();
  }

  visualizar(): void {
    this.estado = null;
    this.desativaTodosAutoComplete()
  }

  limpar(): void {
    this.estado = null;
    this.opcaoEditando = null;
    this.opcaoSelecionada = null;
    this.desativaTodosAutoComplete()
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
    if (this.isFormValido()) {
      this.opcaoService.adicionarOpcao(this.opcaoEditando).subscribe(response => {
        this.snackBar.openSnackBar('Opcao adicionado com sucesso!');
        this.limpar();
        this.carregaTabelaOpcao();
      });
    } else {
      this.erroFormInvalido();
    }
  }

  atualizarOpcao(): void {
    this.opcaoEditando.tabela = this.tabelaAutoCompleteControl.value;
    this.opcaoEditando.produto = this.produtoAutoCompleteControl.value;
    if (this.isFormValido()) {
      this.opcaoService.editarOpcao(this.opcaoEditando).subscribe(response => {
        this.snackBar.openSnackBar('Opcao atualizado com sucesso!');
        this.visualizar();
        this.carregaTabelaOpcao();
        this.opcaoSelecionada = response;
      });
    } else {
      this.erroFormInvalido();
    }
  }

  private erroFormInvalido(): void {
    this.formOpcao.form.markAllAsTouched();
    this.snackBar.openSnackBar("Preencha todos os campos!");
    if (!this.tabelaAutoCompleteControl.value.id){
      this.tabelaAutoCompleteControl.setValue('');
      this.tabelaAutoCompleteControl.markAllAsTouched();
    }
    if (!this.estadoAutoCompleteControl.value.sigla){
      this.estadoAutoCompleteControl.setValue('');
      this.estadoAutoCompleteControl.markAllAsTouched();
    }
    if (!this.produtoAutoCompleteControl.value.id){
      this.produtoAutoCompleteControl.setValue('');
      this.produtoAutoCompleteControl.markAllAsTouched();
    }
    if (!this.operadoraAutoCompleteControl.value.id){
      this.operadoraAutoCompleteControl.setValue('');
      this.operadoraAutoCompleteControl.markAllAsTouched();
    }
    if (!this.administradoraAutoCompleteControl.value.id){
      this.administradoraAutoCompleteControl.setValue('');
      this.administradoraAutoCompleteControl.markAllAsTouched();
    }

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
    if (tabela && tabela.nome) {
      if (tabela.categoria === 'Adesão') {
        return tabela.nome + ' (' + tabela.operadora.nome + ' + ' + tabela.administradora.nome + ')';
      } else if (tabela.categoria === 'Empresarial') {
        return tabela.nome + ' (' + tabela.operadora.nome + ' + ' +
          (tabela.contemplaMEI ? 'Mei' : '') +
          (tabela.livreAdesao ? tabela.contemplaMEI ? ' | LA' : 'LA' : '') +
          (tabela.compulsoria ? (tabela.contemplaMEI || tabela.livreAdesao) ? ' | Comp' : 'Comp' : '') + ')';
      }
    }
    return '';
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

      if (this.filtroOpcao.categoria) {
        opcoesFiltradas = opcoesFiltradas.filter(op => op.tabela.categoria === this.filtroOpcao.categoria);

        if (this.filtroOpcao.categoria === 'Adesão' && this.filtroOpcao.administradoras.length) {
          opcoesFiltradas = opcoesFiltradas.filter(op => this.filtroOpcao.administradoras.filter(adm => op.tabela.administradora && adm.id === op.tabela.administradora.id).length);
        } else if (this.filtroOpcao.categoria === 'Empresarial' && this.filtroOpcao.mei) {
          opcoesFiltradas = opcoesFiltradas.filter(op => op.tabela.contemplaMEI === this.filtroOpcao.mei);
        }
      }

      if (this.filtroOpcao.estados.length) {
        opcoesFiltradas = opcoesFiltradas.filter(op => this.filtroOpcao.estados.filter(e => e.sigla === op.tabela.estado.sigla).length);
      }

      if (this.filtroOpcao.tabelas.length) {
        opcoesFiltradas = opcoesFiltradas.filter(op => this.filtroOpcao.tabelas.filter(t => t.nome === op.tabela.nome).length);
      }

      if (this.filtroOpcao.acomodacao) {
        opcoesFiltradas = opcoesFiltradas.filter(op => op.acomodacao === this.filtroOpcao.acomodacao);
      }

      if (this.filtroOpcao.coparticipacao != null && typeof this.filtroOpcao.coparticipacao === "boolean") {
        opcoesFiltradas = opcoesFiltradas.filter(op => op.coparticipacao === this.filtroOpcao.coparticipacao);
      }

      if (this.filtroOpcao.operadoras.length) {
        opcoesFiltradas = opcoesFiltradas.filter(op => this.filtroOpcao.operadoras.filter(o => o.id === op.tabela.operadora.id).length);
      }

      if (this.filtroOpcao.produtos.length) {
        opcoesFiltradas = opcoesFiltradas.filter(op => this.filtroOpcao.produtos.filter(p => p.id === op.produto.id).length);
      }

      if (this.filtroOpcao.profissoes.length) {
        opcoesFiltradas = opcoesFiltradas.filter(op => op.tabela.entidades.filter(e => e.profissoes.filter(p => this.filtroOpcao.profissoes.filter(fp => p.id === fp.id).length).length).length);
      }

      if (this.filtroOpcao.abrangencia) {
        opcoesFiltradas = opcoesFiltradas.filter(op => op.produto.abrangencia === this.filtroOpcao.abrangencia);
      }

      if (this.filtroOpcao.reajustes.length) {
        opcoesFiltradas = opcoesFiltradas.filter(op => this.filtroOpcao.reajustes.filter(r => r === op.tabela.reajuste).length);
      }

      if (this.filtroOpcao.tipoFiltro) {

        opcoesFiltradas = this.filtraOpcaoPorProduto(opcoesFiltradas, this.filtroOpcao, 'reembolso');
        opcoesFiltradas = this.filtraOpcaoPorTabela(opcoesFiltradas, this.filtroOpcao, 'idadeMinima');
        opcoesFiltradas = this.filtraOpcaoPorTabela(opcoesFiltradas, this.filtroOpcao, 'idadeMaxima');
        opcoesFiltradas = this.filtraOpcaoPorTabela(opcoesFiltradas, this.filtroOpcao, 'qtdMinVidas');
        opcoesFiltradas = this.filtraOpcaoPorTabela(opcoesFiltradas, this.filtroOpcao, 'qtdMinTitulares');

      }

      this.configuraTabelaOpcao(opcoesFiltradas);

    });
  }

  filtrar(): void {
    this.reajusteService.getAllReajustes().subscribe(response => this.todosReajustes = response);
    this.todasTabelas = this.todasOpcoes.map(op => op.tabela).filter(UtilService.filtraDuplicadasNome);
    this.todosProdutos = this.todasOpcoes.map(op => op.produto).filter(UtilService.filtraDuplicadasId);
    this.todosEstados = this.todasOpcoes.map(op => op.tabela.estado).filter(UtilService.filtraDuplicadasNome);
    this.todasOperadoras = this.todasOpcoes.map(op => op.tabela.operadora).filter(UtilService.filtraDuplicadasId);
    this.todasAdministradoras = this.todasOpcoes.filter(op => op.tabela.administradora).map(op => op.tabela.administradora).filter(UtilService.filtraDuplicadasId);
    this.todasAbrangencias = this.todasOpcoes.map(op => op.produto.abrangencia).filter(UtilService.filtraDuplicadasString);

    this.estado = 'filtrando';
    this.opcaoSelecionada = null;
    this.filtroOpcao = new FiltroOpcao();
  }

  private filtraOpcaoPorProduto(opcoesFiltradas: Opcao[], filtro: any, property: string) {
    if (filtro[property]) {
      switch (filtro.tipoFiltro) {
        case '<':
          return opcoesFiltradas.filter(op => op.produto[property] <= this.filtroOpcao[property]);
        case '=':
          return opcoesFiltradas.filter(op => op.produto[property] === this.filtroOpcao[property]);
        case '>':
          return opcoesFiltradas.filter(op => op.produto[property] >= this.filtroOpcao[property]);
      }
    }
    return opcoesFiltradas;
  }

  private filtraOpcaoPorTabela(opcoesFiltradas: Opcao[], filtro: any, property: string) {
    if (filtro[property]) {
      switch (filtro.tipoFiltro) {
        case '<':
          return opcoesFiltradas.filter(op => op.tabela[property] <= this.filtroOpcao[property]);
        case '=':
          return opcoesFiltradas.filter(op => op.tabela[property] === this.filtroOpcao[property]);
        case '>':
          return opcoesFiltradas.filter(op => op.tabela[property] >= this.filtroOpcao[property]);
      }
    }
    return opcoesFiltradas;
  }

  cancelarFiltro(): void {
    this.cancelarAdicao();
  }

  getTableWidth(): string {
    return (this.displayedColumns?.length * 125)  +'px';
  }

  onSubmit(): void {
    if (this.adicionandoOpcao()) {
      this.salvarNovaOpcao();
    } else if (this.editandoOpcao()) {
      this.atualizarOpcao();
    }
  }

  handleKeyboardEventForm($event: KeyboardEvent, elementRef: any) {
    if ($event.code === 'Enter') {
      $event.preventDefault();
      elementRef.focus();
      elementRef.select();
    }
  }

  handleKeyboardEventEstadoInput($event: KeyboardEvent, elementRef: any) {
    if (this.isCategoriaAdesao()) {
      this.handleKeyboardEventForm($event, this.administradoraInput.nativeElement);
    } else {
      this.handleKeyboardEventForm($event, elementRef);
    }
  }

  isFormValido(): boolean {
    if (this.isCategoriaAdesao()) {
      return this.formOpcao.valid &&
        this.estadoAutoCompleteControl.value?.sigla != null &&
        this.administradoraAutoCompleteControl.value?.id != null &&
        this.operadoraAutoCompleteControl.value?.id != null &&
        this.opcaoEditando.tabela?.id != null &&
        this.opcaoEditando.produto?.id != null;
    } else if (this.isCategoriaEmpresarial()) {
      return this.formOpcao.valid &&
        this.estadoAutoCompleteControl.value?.sigla != null &&
        this.operadoraAutoCompleteControl.value?.id != null &&
        this.opcaoEditando.tabela?.id != null &&
        this.opcaoEditando.produto?.id != null;
    }
    return false;
  }

}
