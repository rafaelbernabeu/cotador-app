import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {UsuarioComponent} from './components/usuario/usuario.component';
import {EntidadeComponent} from './components/entidade/entidade.component';
import {CotacaoComponent} from './components/cotacao/cotacao.component';
import {ProdutoComponent} from './components/produto/produto.component';
import {HospitalComponent} from './components/hospital/hospital.component';
import {LaboratorioComponent} from './components/laboratorio/laboratorio.component';
import {ProfissaoComponent} from './components/profissao/profissao.component';
import {OperadoraComponent} from './components/operadora/operadora.component';
import {AdministradoraComponent} from './components/administradora/administradora.component';
import {AuditoriaComponent} from './components/auditoria/auditoria.component';
import {TabelaComponent} from './components/tabela/tabela.component';
import {OpcaoComponent} from './components/opcao/opcao.component';

const routes: Routes = [

  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'opcoes', component: OpcaoComponent },
  { path: 'tabela', component: TabelaComponent },
  { path: 'cotacao', component: CotacaoComponent },
  { path: 'usuarios', component: UsuarioComponent },
  { path: 'produtos', component: ProdutoComponent },
  { path: 'entidades', component: EntidadeComponent },
  { path: 'hospitais', component: HospitalComponent },
  { path: 'auditoria', component: AuditoriaComponent },
  { path: 'profissoes', component: ProfissaoComponent },
  { path: 'operadoras', component: OperadoraComponent },
  { path: 'laboratorios', component: LaboratorioComponent },
  { path: 'administradoras', component: AdministradoraComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
