export interface Pelicula {
    titulo: string;
    fechaEstreno: number;
    reparto: string[];
    generos: string[];
    href: string;
    resumen: string;
    imagen: string;
    anchoImagen: number;
    altoImagen: number;
    enCartel : string;
}


  export interface Pelis {
    title: string;
    year: number;
    cast: string[];
    genres: string[];
    href: string;
    extract: string;
    thumbnail: string;
    thumbnail_width: number;
    thumbnail_height: number;
  }