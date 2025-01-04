export type PeliculaCines = {
  id: number,
  titulo: string,
  imagen: string,
  anchoImagen: number,
  altoImagen: number,
  cines:{nombre: string, horarios: string[]}[]
}| undefined;

export type PeliculaCart = {
  id: number,
  titulo: string,
  imagen: string,
  anchoImagen: number,
  altoImagen: number,
  horario: string[]
}
export type CineCart = {
  id: number,
  nombre: string,
  peliculas: PeliculaCart[],
  latitud: number
  longitud: number
}
export type Cines = {
  fecha: string, //Formato YYYY-MM-DD
  cines: CineCart[]
}
