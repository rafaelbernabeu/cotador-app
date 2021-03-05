import { Component, OnInit } from '@angular/core';
import {CotacaoService} from "../../services/cotacao/cotacao.service";
import {Cotacao} from "../../services/cotacao/cotacao";
import {CategoriaService} from "../../services/categoria/categoria.service";
import {Categoria} from "../../services/categoria/categoria";
import {FormControl} from "@angular/forms";
import {Estado} from "../../services/estado/estado";
import {Profissao} from "../../services/profissao/profissao";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {ProfissaoService} from "../../services/profissao/profissao.service";
import {Acomodacao} from "../../services/acomodacao/Acomodacao";
import {AcomodacaoService} from "../../services/acomodacao/acomodacao.service";
import {EstadoService} from "../../services/estado/estado.service";

@Component({
  selector: 'app-cotacao',
  templateUrl: './cotacao.component.html',
  styleUrls: ['./cotacao.component.scss']
})
export class CotacaoComponent implements OnInit {

  cotacao: Cotacao = new Cotacao();
  todosEstados: Estado[];
  todasCategorias: Categoria[];
  todasProfissoes: Profissao[];
  todasAcomodacoes: Acomodacao[];

  estadoAutoCompleteControl = new FormControl();
  profissaoAutoCompleteControl = new FormControl();

  estadoFilteredOptions: Observable<Estado[]>;
  profissaoFilteredOptions: Observable<Profissao[]>;

  constructor(
    private estadoService: EstadoService,
    private cotacaoService: CotacaoService,
    private categoriaService: CategoriaService,
    private profissaoService: ProfissaoService,
    private acomodacaoService: AcomodacaoService,
  ) { }

  ngOnInit(): void {
    this.iniciaAutoCompletes();
    this.cotacaoService.getCotacao(this.cotacao).subscribe(response => console.log(response));
    this.estadoService.getAllEstados().subscribe(response => this.todosEstados = response);
    this.categoriaService.getAllCategorias().subscribe(response => this.todasCategorias = response);
    this.profissaoService.getAllProfissoes().subscribe(response => this.todasProfissoes = response);
    this.acomodacaoService.getAllAcomodacoes().subscribe(response => this.todasAcomodacoes = response);
  }

  consultaCotacaoCategoria(categoria: Categoria): void {
    this.cotacao.categoria = categoria;
    this.cotacaoService.getCotacao(this.cotacao).subscribe(response => console.log(response));
  }

  private iniciaAutoCompletes(): void {
    this.estadoFilteredOptions = this.estadoAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.estadoFilterAutoComplete(value))
    );
    this.profissaoFilteredOptions = this.profissaoAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.profissaoFilterAutoComplete(value))
    );
  }

  private estadoFilterAutoComplete(value: string): Estado[] {
    const filterValue = value?.toLowerCase();
    return this.todosEstados?.filter(estado => estado.nome.toLowerCase().includes(filterValue) || estado.sigla.toLowerCase().includes(filterValue));
  }

  private profissaoFilterAutoComplete(value: string): Profissao[] {
    const filterValue = value?.toLowerCase();
    return this.todasProfissoes?.filter(profissao => profissao.nome.toLowerCase().includes(filterValue));
  }

  estadoDisplayFn(estado: Estado): string {
    return estado && estado.nome ? estado.nome : '';
  }

  profissaoDisplayFn(profissao: Profissao): string {
    return profissao && profissao.nome ? profissao.nome : '';
  }
}
