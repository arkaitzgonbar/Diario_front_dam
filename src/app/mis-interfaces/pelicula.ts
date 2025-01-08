export interface Pelicula {
  id : number;
  titulo: string;
  fechaEstreno: number;
  genero: string;
  reparto: string;
  resumen: string;
  imagen: string;
  anchoImagen: number;
  altoImagen: number;
}
export interface PeliculaLista{
  listaId : number;
  peliculaId:number;
}

export interface Valoracion{
  votado: boolean;
  peliculaId:number;
  //usuarioId:number; //Si descomentamos da error en modal
  puntuacion: number;
}

/*
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
    */


export interface Usuario{
  id : number;
  email: string;
  password: string;
  nombre: string;
}

export interface Votos{
  id : number;
  peliculaId: number;
  usuarioId : number;
  puntuacion : number;
}


