import {Role} from '../role/role';

export class Usuario {

  id: number;
  nome: string;
  email: string;
  password: string;
  roles: Role[];

}
