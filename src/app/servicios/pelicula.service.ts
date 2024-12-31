import {inject, Injectable, signal} from '@angular/core';
import {Valoracion} from "../mis-interfaces/pelicula";
import {toObservable} from "@angular/core/rxjs-interop";
import {ApiService} from "./api.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PeliculaService {
  private api = inject(ApiService);

  private valoracion = signal<Valoracion|undefined>(undefined);

  valoracion$ = toObservable(this.valoracion);

  constructor() { }

  /**
   *
   * @param pelicula
   */
  public loadValoracion(pelicula:number){
    this.api.get(environment.ruta_valoracion)
      .subscribe({
        next:(response:Valoracion) => {
          console.log()
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
