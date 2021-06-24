import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  public static getDate(dataHora: any): Date {
    return new Date(dataHora[0], (dataHora[1] - 1), dataHora[2], dataHora[3], dataHora[4], dataHora[5]);
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

  public static equalsById(item1: {id}, item2: {id}): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }

  public static equalsByNome(item1: {nome}, item2: {nome}): boolean {
    return item1 && item2 ? item1.nome === item2.nome : item1 === item2;
  }

  public static downloadFile(data: any) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

}
