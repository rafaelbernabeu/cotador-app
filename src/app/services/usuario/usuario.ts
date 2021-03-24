import {Role} from '../role/role';
import {Geolocation} from "./geolocation";

export class Usuario {

  id: number;
  nome: string;
  email: string;
  password: string;

  roles: Role[];
  geolocation: Geolocation;

}
