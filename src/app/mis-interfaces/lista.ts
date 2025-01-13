import {Pelicula, Usuario} from "./pelicula";

//Usamos esta clase para el metodo Get y Delete (necesitamos el id)
export interface Lista{
  id: number;
  nombre: string;
  peliculas: Pelicula[];
}
