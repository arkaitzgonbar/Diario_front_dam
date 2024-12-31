import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { empty, Observable } from 'rxjs';
import { Pelicula } from '../mis-interfaces/pelicula';
import { Cartelera } from '../mis-interfaces/cartelera';


@Injectable({
  providedIn: 'root'
})
export class CargarPelisService {

  private jsonUrl = '/assets/movies-2020s-con-enCartel-string.json'; //Url para cargar el json de las películas. Habrá que sustituirlo por url api.
  private jsonUrlCartelera = 'assets/pelis.json'; // Ruta al archivo JSON

  /***********************************************************************
   * Si lo usais vuestra API desde local, cambiar esta url a http://localhost:8000/
   **********************************************************************/
  private apiUrl: string = "http://10.2.56.127:8000/"; //Arkaitz
  public movies: Cartelera[] = [];
  private tituloPeliculaSeleccionada: string = '';

  constructor(private http: HttpClient) { }

  // Método que permite obtener todas las películas desde el json/api
  getPeliculas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.apiUrl + "api/peliculas");
  }

  //Metodo que carga los generos mediante el endpoint de la API
  cargaGeneros(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl + "api/peliculas/generos");
  }

  //Llama al metodo de busqueda de peliculas por parametro de la API
  buscarPeliculas(
    genero: string | null,
    reparto: string | null,
    fechaEstreno: number | null,
    titulo: string | null
  ): Observable<Pelicula[]> {

    let urlFiltros: string = "api/peliculas/buscar/genero_reparto_fecha_titulo?";

    //MODIFICADO DESCOMENTAR EL CODIGO DE ABAJO SI NO FUNCIONA
    let values:string[] = [];
    if (genero !=="null" && genero !== "")
      values.push("genero=" + genero);

    if (reparto !=="null" && reparto !== "")
      values.push("reparto=" + reparto);

    if (fechaEstreno !== null)
      values.push("fechaEstreno=" + fechaEstreno);

    if (titulo !== "")
      values.push("titulo=" + titulo);

    const filtros = values.join('&');

    console.log("URL API " + this.apiUrl + filtros)

     return this.http.get<Pelicula[]>(this.apiUrl + urlFiltros);

    // let existeParam: boolean = false;
    //
    // let respuesta: Observable<Pelicula[]> = empty();
    //
    // if (genero !=="null" && genero !== ""){
    //   urlFiltros += "genero=" + genero;
    //   existeParam = true;
    // }
    // if (genero == ""){
    //   console.log("Valor genero vacio: " + genero);
    // }
    //
    // if (reparto !=="null" && reparto !== ""){
    //   if(existeParam){
    //     urlFiltros += "&reparto=" + reparto;
    //   }else{
    //     urlFiltros += "reparto=" + reparto;
    //   }
    //   existeParam = true;
    // }
    //
    // if (fechaEstreno !== null){
    //   if(existeParam){
    //     urlFiltros += "&fechaEstreno=" + fechaEstreno;
    //   }else{
    //     urlFiltros += "fechaEstreno=" + fechaEstreno;
    //   }
    //   existeParam = true;
    // }
    //
    // if (titulo !== ""){
    //   if(existeParam){
    //     urlFiltros += "&titulo=" + titulo;
    //   }else{
    //     urlFiltros += "titulo=" + titulo;
    //   }
    //   existeParam = true;
    // }
    // console.log("URL API " + this.apiUrl + urlFiltros)
    //
    // return respuesta = this.http.get<Pelicula[]>(this.apiUrl + urlFiltros);
  }

  // Método para guardar el título de una película seleccionada.Nos hará falta para la geolocalización en el tab3.
  setTituloPeliculaSeleccionada(titulo: string) {
    this.tituloPeliculaSeleccionada = titulo;

  }

  // Método para obtener el título de la película seleccionada. Nos hará falta para la geolocalización en el tab3.
  getTituloPeliculaSeleccionada(): string {
    return this.tituloPeliculaSeleccionada;
  }

  // Método para filtrar películas por título
  filtrarPorTitulo(peliculas: Pelicula[], titulo: string): Pelicula[] {
    return peliculas.filter(pelicula =>
      pelicula.titulo.toLowerCase().includes(titulo.toLowerCase())
    );
  }

  // Método para filtrar películas por género
  /*filtrarPorGeneros(peliculas: Pelicula[], genero: string): Pelicula[] {
    return peliculas.filter(pelicula =>
     pelicula.generos.some(g => g.toLowerCase() === genero.toLowerCase())
    );
  }*/

  // Método para filtrar películas por año de lanzamiento
  filtrarPorFechaEstreno(peliculas: Pelicula[], fechaEstreno: number): Pelicula[] {
    return peliculas.filter(pelicula => pelicula.fechaEstreno === fechaEstreno);
  }

  // Método para obtener la cartelera falsa del Json
  getCartelera(): Observable<Cartelera[]> {
    return this.http.get<Cartelera[]>(this.jsonUrlCartelera);
  }

}
