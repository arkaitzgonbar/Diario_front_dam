import {inject, Injectable, signal} from '@angular/core';
import {Pelicula, Valoracion} from "../mis-interfaces/pelicula";
import {toObservable} from "@angular/core/rxjs-interop";
import {ApiService} from "./api.service";
import {environment} from "../../environments/environment";
import {map, Observable} from "rxjs";
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PeliculaService {
  private api = inject(ApiService);

  private alertController = inject(AlertController);
  private valoracion = signal<Valoracion|undefined>(undefined);

  valoracion$ = toObservable(this.valoracion);

  constructor() { }

  /**
   * Permite obtener todas las películas desde la api
   */
  getPeliculas(): Observable<Pelicula[]> {
    return this.api.get<Pelicula[]>(environment.ruta_peliculas).pipe(
      map((value:Pelicula[]) => {
        return value.map(peli =>{
          if(!peli.imagen){
            peli.imagen = 'assets/sin-imagen.png';
          }
          return peli;
        })

      })
    );
  }


  /**
   * Metodo que carga los generos mediante el endpoint de la API
   */
  cargaGeneros(): Observable<string[]> {
    return this.api.get<string[]>(environment.ruta_generos);
    //return this.http.get<string[]>(this.apiUrl + "api/peliculas/generos");
  }

  /***
   * Carga las peliculas en cartelera para enseñar al inicio de la aplicacion
   */
  getCartelera():Observable<Pelicula[]>{
    return this.api.get<Pelicula[]>(environment.peliculas_cartelera);
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
    return this.api.get<Pelicula[]>(environment.ruta_buscar + '?' + filtros);
  }

  /**
   *
   * @param pelicula
   */
  public loadValoracion(pelicula:number){
    const url = environment.ruta_valoracion + '/' + pelicula
    console.log(url);
    this.api.get(url)
      .subscribe({
        next:(response:Valoracion) => {
          console.log("Respuesta recibida:", response);
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
    //console.log("Votado: " + valoracion.votado);
    //console.log(valoracion);
    //if(valoracion.votado == false){

    this.api.post(environment.ruta_valoracion, valoracion)
      .subscribe({
        next:(response:Valoracion) => {
          this.valoracion.set(response);
          console.log("ValoracionDTO: " + valoracion.puntuacion);
          console.log(response);
        },
        error:((e)=>console.log("ERROR añadiendo valoracion"))
      });
    /*}else{
      this.presentAlert();
      console.log("Ya has votado esta pelicula")
    }*/

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: 'No puedes votar porque ya has votado esta película.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
