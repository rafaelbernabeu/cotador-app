import {AppComponent} from './app.component';
import localePt from '@angular/common/locales/pt';
import {LOCALE_ID, NgModule} from '@angular/core';
import {ColorPickerModule} from "ngx-color-picker";
import {registerLocaleData} from "@angular/common";
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSortModule} from '@angular/material/sort';
import {MatTabsModule} from "@angular/material/tabs";
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ClipboardModule} from "@angular/cdk/clipboard";
import {MatRippleModule} from '@angular/material/core';
import {MatChipsModule} from "@angular/material/chips";
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatTableModule} from '@angular/material/table';
import {BrowserModule} from '@angular/platform-browser';
import {AuthService} from './services/auth/auth.service';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HomeComponent} from './components/home/home.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {LoginComponent} from './components/login/login.component';
import {OpcaoComponent} from './components/opcao/opcao.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {DialogComponent} from './components/dialog/dialog.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {TabelaComponent} from './components/tabela/tabela.component';
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {CotacaoComponent} from './components/cotacao/cotacao.component';
import {ProdutoComponent} from './components/produto/produto.component';
import {UsuarioComponent} from './components/usuario/usuario.component';
import {EntidadeComponent} from './components/entidade/entidade.component';
import {HospitalComponent} from './components/hospital/hospital.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuditoriaComponent} from './components/auditoria/auditoria.component';
import {OperadoraComponent} from './components/operadora/operadora.component';
import {ProfissaoComponent} from './components/profissao/profissao.component';
import {LaboratorioComponent} from './components/laboratorio/laboratorio.component';
import {AdministradoraComponent} from './components/administradora/administradora.component';
import {AuditoriaLoginComponent} from './components/auditoria-login/auditoria-login.component';
import {AuditoriaCotacaoComponent} from './components/auditoria-cotacao/auditoria-cotacao.component';
import {AuditoriaAlteracoesComponent} from './components/auditoria-alteracoes/auditoria-alteracoes.component';
import {HttpInterceptorService} from "./services/interceptor/http-interceptor.service";

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
    ClipboardModule,
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
    MatMomentDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    ColorPickerModule,
  ],
  providers: [
    AuthService,
    { provide: LOCALE_ID, useValue: "pt" },
    { provide: 'Window',  useValue: window },
    { provide: 'Navigator',  useValue: navigator },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
