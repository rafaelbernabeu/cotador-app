import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Hospital} from '../hospital/hospital';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllHospitais(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  public adicionarHospital(hospital: Hospital): Observable<Hospital> {
    return this.http.post<Hospital>(this.getApiUrl(), hospital, this.authServie.getTokenHeader());
  }

  public editarHospital(hospital: Hospital): Observable<Hospital> {
    return this.http.put<Hospital>(this.getApiUrl() + '/' + hospital.id, hospital, this.authServie.getTokenHeader());
  }

  public excluirHospital(hospital: Hospital): Observable<Hospital> {
    return this.http.delete<Hospital>(this.getApiUrl() + '/' + hospital.id, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.HOSPITAL_API_URL;
  }

}
