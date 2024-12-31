import {inject, Injectable, signal} from '@angular/core';
import {ApiService} from "./api.service";
import {Lista} from "../mis-interfaces/lista";
import {toObservable} from "@angular/core/rxjs-interop";
import {PeliculaLista} from "../mis-interfaces/pelicula";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ListaService {
  private api = inject(ApiService);

  private listas = signal<Lista[]>([]);
  listas$ = toObservable(this.listas);
  constructor() { }

  /**
   *Carga todas las listas relacionadas con un usuario
   */
  public loadListas(){
    this.api.get(environment.ruta_lista)
      .subscribe({
        next:(response:Lista[]) => {
          this.listas.set(response);
        },
        error:((e)=>console.log("ERROR"))
      });
  }

  /**
   * Cambia una pelicula de una lista a otra
   * @param pl
   */
  public updatePeliculaLista(pl: PeliculaLista){
    this.api.post('assets/todos.json', pl) .subscribe({
      next:(response:Lista[]) => {
        this.listas.set([]);
        this.listas.set(response);
      },
      error:((e)=>console.log("ERROR"))
    });
  }

  /**
   * Devuelve el id de la lista donde está la pelicula sino está en ninguna lista devuelve -1
   * @param id
   */
  public getPeliculaLista(id: number):number{
    let listaId =  this.listas().find(lista =>
      lista.peliculas.find(pelicula => pelicula.id === id)
    )?.id;

    return listaId ? listaId : -1;
  }

}
