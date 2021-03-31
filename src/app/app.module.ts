import localePt from '@angular/common/locales/pt';
import {AdministradoraComponent} from './components/administradora/administradora.component';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AuditoriaComponent} from './components/auditoria/auditoria.component';
import {AuthService} from './services/auth/auth.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {ColorPickerModule} from "ngx-color-picker";
import {CotacaoComponent} from './components/cotacao/cotacao.component';
import {DialogComponent} from './components/dialog/dialog.component';
import {EntidadeComponent} from './components/entidade/entidade.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from './components/home/home.component';
import {HospitalComponent} from './components/hospital/hospital.component';
import {HttpClientModule} from '@angular/common/http';
import {LOCALE_ID, NgModule} from '@angular/core';
import {LaboratorioComponent} from './components/laboratorio/laboratorio.component';
import {LoginComponent} from './components/login/login.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from "@angular/material/chips";
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatRadioModule} from '@angular/material/radio';
import {MatRippleModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {OpcaoComponent} from './components/opcao/opcao.component';
import {OperadoraComponent} from './components/operadora/operadora.component';
import {ProdutoComponent} from './components/produto/produto.component';
import {ProfissaoComponent} from './components/profissao/profissao.component';
import {TabelaComponent} from './components/tabela/tabela.component';
import {UsuarioComponent} from './components/usuario/usuario.component';
import {registerLocaleData} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {AuditoriaLoginComponent} from './components/auditoria-login/auditoria-login.component';
import {AuditoriaCotacaoComponent} from './components/auditoria-cotacao/auditoria-cotacao.component';
import {AuditoriaAlteracoesComponent} from './components/auditoria-alteracoes/auditoria-alteracoes.component';

registerLocaleData(localePt, 'pt');

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
    AuditoriaLoginComponent,
    AuditoriaCotacaoComponent,
    AuditoriaAlteracoesComponent,
  ],
  imports: [
    FormsModule,
    MatIconModule,
    MatCardModule,
    BrowserModule,
    MatSortModule,
    MatMenuModule,
    MatListModule,
    MatTabsModule,
    MatInputModule,
    MatTableModule,
    MatChipsModule,
    MatRadioModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatRippleModule,
    HttpClientModule,
    MatDividerModule,
    AppRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    ColorPickerModule,
  ],
  providers: [
    AuthService,
    { provide: 'Window',  useValue: window },
    { provide: 'Navigator',  useValue: navigator },
    { provide: LOCALE_ID, useValue: "pt" },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
