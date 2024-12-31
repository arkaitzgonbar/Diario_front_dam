import {Pelicula, Usuario} from "./pelicula";

export interface Lista{
  id: number;
  nombre: string;
  peliculas: Pelicula[];
}
