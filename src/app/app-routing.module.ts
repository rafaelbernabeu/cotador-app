import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {UsuarioComponent} from './components/usuario/usuario.component';
import {EntidadeComponent} from './components/entidade/entidade.component';

const routes: Routes = [

  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'usuarios', component: UsuarioComponent },
  { path: 'entidades', component: EntidadeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
