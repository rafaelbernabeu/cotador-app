import { Injectable } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../api/api.service";
import {Observable} from "rxjs";
import {Cotacao} from "./cotacao";
import {Opcao} from "../opcao/opcao";

@Injectable({
  providedIn: 'root'
})
export class CotacaoService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getCotacao(cotacao: Cotacao): Observable<Opcao[]> {
    return this.http.post<Opcao[]>(this.getApiUrl(), cotacao, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.COTACAO_API_URL;
  }
}
