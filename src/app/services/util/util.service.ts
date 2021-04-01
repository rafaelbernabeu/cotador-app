import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  public getDate(dataHora: any): Date {
    return new Date(dataHora[0],dataHora[1],dataHora[2],dataHora[3],dataHora[4],dataHora[5],dataHora[6]);
  }

  public static filtraDuplicadasId(value: { id }, index, self: { id }[]): boolean {
    const searchElement: {id} = self.filter(item => item.id === value.id)[0];
    return self.indexOf(searchElement) === index;
  }

  public static filtraDuplicadasNome(value: { nome }, index, self: { nome }[]): boolean {
    const searchElement = self.filter(item => item.nome === value.nome)[0];
    return self.indexOf(searchElement) === index;
  }

  public static filtraDuplicadasString(value: string, index, self: string[]): boolean {
    const searchElement = self.filter(item => item === value)[0];
    return self.indexOf(searchElement) === index;
  }

  public static filtraListaPorValorProperty(lista: any[], filtro: any, property: string) {
    if (filtro[property]) {
      switch (filtro['tipoFiltro']) {
        case '<':
          return lista.filter(i => i[property] <= filtro[property]);
        case '=':
          return lista.filter(i => i[property] === filtro[property]);
        case '>':
          return lista.filter(i => i[property] >= filtro[property]);
      }
    }
    return lista;
  }

}
