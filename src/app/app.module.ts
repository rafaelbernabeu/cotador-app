import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from './services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HomeComponent } from './components/home/home.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LoginComponent } from './components/login/login.component';
import { OpcaoComponent } from './components/opcao/opcao.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { TabelaComponent } from './components/tabela/tabela.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { CotacaoComponent } from './components/cotacao/cotacao.component';
import { ProdutoComponent } from './components/produto/produto.component';
import { EntidadeComponent } from './components/entidade/entidade.component';
import { HospitalComponent } from './components/hospital/hospital.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfissaoComponent } from './components/profissao/profissao.component';
import { OperadoraComponent } from './components/operadora/operadora.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';
import { LaboratorioComponent } from './components/laboratorio/laboratorio.component';
import { AdministradoraComponent } from './components/administradora/administradora.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OpcaoComponent,
    LoginComponent,
    DialogComponent,
    TabelaComponent,
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
    MatSelectModule,
    MatDialogModule,
    HttpClientModule,
    MatDividerModule,
    AppRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
