import {Injectable} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../api/api.service";
import {Observable} from "rxjs";
import {AuditoriaLogin} from "./auditoria-login";
import {AuditoriaCotacao} from "./auditoria-cotacao";
import {AuditoriaAlteracao} from "./auditoria-alteracao";
import {ConsultaAuditoria} from "./consulta-auditoria";

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public downloadLoginsCSV(consultaAuditoria: ConsultaAuditoria): Observable<Blob> {
    return this.http.post(this.getLoginApiUrl() + '/download', consultaAuditoria, {
      headers: this.authServie.getTokenHeader().headers,
      responseType: 'blob'
    });
  }

  public downloadCotacoesCSV(consultaAuditoria: ConsultaAuditoria): Observable<Blob> {
    return this.http.post(this.getCotacaoApiUrl() + '/download', consultaAuditoria, {
      headers: this.authServie.getTokenHeader().headers,
      responseType: 'blob'
    });
  }

  public downloadAlteracoesCSV(consultaAuditoria: ConsultaAuditoria): Observable<Blob> {
    return this.http.post(this.getAlteracaoApiUrl() + '/download', consultaAuditoria, {
      headers: this.authServie.getTokenHeader().headers,
      responseType: 'blob'
    });
  }

  public getAllLogins(consultaAuditoria: ConsultaAuditoria): Observable<AuditoriaLogin[]> {
    return this.http.post<AuditoriaLogin[]>(this.getLoginApiUrl(), consultaAuditoria, this.authServie.getTokenHeader());
  }

  public getAllCotacoes(consultaAuditoria: ConsultaAuditoria): Observable<AuditoriaCotacao[]> {
    return this.http.post<AuditoriaCotacao[]>(this.getCotacaoApiUrl(), consultaAuditoria, this.authServie.getTokenHeader());
  }

  public getAllAlteracoes(consultaAuditoria: ConsultaAuditoria): Observable<AuditoriaAlteracao[]> {
    return this.http.post<AuditoriaAlteracao[]>(this.getAlteracaoApiUrl(), consultaAuditoria, this.authServie.getTokenHeader());
  }

  private getLoginApiUrl(): string {
    return this.api.BASE_API_URL + this.api.AUDIT_LOGIN_API_URL;
  }

  private getCotacaoApiUrl(): string {
    return this.api.BASE_API_URL + this.api.AUDIT_COTACAO_API_URL;
  }

  private getAlteracaoApiUrl(): string {
    return this.api.BASE_API_URL + this.api.AUDIT_ALTERACAO_API_URL;
  }

}
