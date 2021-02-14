import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth/auth.service';
import { HomeComponent } from './components/home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { EntidadeComponent } from './components/entidade/entidade.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProfissaoComponent } from './components/profissao/profissao.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { CotacaoComponent } from './components/cotacao/cotacao.component';
import { ProdutoComponent } from './components/produto/produto.component';
import { HospitalComponent } from './components/hospital/hospital.component';
import { LaboratorioComponent } from './components/laboratorio/laboratorio.component';
import { OperadoraComponent } from './components/operadora/operadora.component';
import { AdministradoraComponent } from './components/administradora/administradora.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';
import { TabelaComponent } from './components/tabela/tabela.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DialogComponent,
    UsuarioComponent,
    CotacaoComponent,
    ProdutoComponent,
    EntidadeComponent,
    HospitalComponent,
    ProfissaoComponent,
    OperadoraComponent,
    AuditoriaComponent,
    LaboratorioComponent,
    AdministradoraComponent,
    TabelaComponent,
  ],
  imports: [
    FormsModule,
    MatIconModule,
    MatCardModule,
    BrowserModule,
    MatSortModule,
    MatMenuModule,
    MatListModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    HttpClientModule,
    MatDividerModule,
    AppRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
