import {inject, Injectable, signal} from '@angular/core';
import {Pelicula, Valoracion} from "../mis-interfaces/pelicula";
import {toObservable} from "@angular/core/rxjs-interop";
import {ApiService} from "./api.service";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PeliculaService {
  private api = inject(ApiService);

  private valoracion = signal<Valoracion|undefined>(undefined);

  valoracion$ = toObservable(this.valoracion);

  constructor() { }

  /**
   * Permite obtener todas las películas desde la api
   */
  getPeliculas(): Observable<Pelicula[]> {
    return this.api.get(environment.ruta_peliculas);
    //return this.http.get<Pelicula[]>(this.apiUrl + "api/peliculas");
  }


  /**
   * Metodo que carga los generos mediante el endpoint de la API
   */
  cargaGeneros(): Observable<string[]> {
    return this.api.get(environment.ruta_generos);
    //return this.http.get<string[]>(this.apiUrl + "api/peliculas/generos");
  }

  /***
   * Carga las peliculas en cartelera para enseñar al inicio de la aplicacion
   */
  getCartelera():Observable<Pelicula[]>{
    return this.api.get(environment.ruta_pelicula_lista);
  }

  /**
   * Llama al metodo de busqueda de peliculas por parametro de la API
   * @param genero
   * @param reparto
   * @param fechaEstreno
   * @param titulo
   */
  buscarPeliculas(
    genero: string | null,
    reparto: string | null,
    fechaEstreno: number | null,
    titulo: string | null
  ): Observable<Pelicula[]> {

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
    return this.api.get(environment.ruta_buscar + '?' + filtros);
  }

  /**
   *
   * @param pelicula
   */
  public loadValoracion(pelicula:number){
    const url = environment.ruta_valoracion + '/' + pelicula
    this.api.get(url)
      .subscribe({
        next:(response:Valoracion) => {
          console.log(response)
          this.valoracion.set(response);
        },
        error:((e)=>console.log("ERRORVAL"+e))
      });
  }

  /**
   * Añade la valoracion
   * @param valoracion
   */
  public addValoracion(valoracion: Valoracion){
    this.api.post(environment.ruta_valoracion, valoracion)
      .subscribe({
        next:(response:Valoracion) => {
          this.valoracion.set(response);
        },
        error:((e)=>console.log("ERROR"))
      });
  }
}
