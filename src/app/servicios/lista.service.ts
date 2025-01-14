import {inject, Injectable, signal} from '@angular/core';
import {ApiService} from "./api.service";
import {Lista} from "../mis-interfaces/lista";
import {toObservable} from "@angular/core/rxjs-interop";
import {Pelicula, PeliculaLista} from "../mis-interfaces/pelicula";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ListaService {
  private api = inject(ApiService);

  private listas = signal<Lista[]>([]);
  listas$ = toObservable(this.listas);

  private listas2 = signal<Lista[]>([]);
  constructor() { }

  /**
   *Carga todas las listas relacionadas con un usuario
   */
  public loadListas(){
    this.api.get(environment.ruta_lista)
      .subscribe({
        next:(response:Lista[]) => this.listas.set(response),
        error:((e)=>console.log("ERROR"))
      });
  }

  /**
   *
   * @param lista
   */
  public addLista(nombre: string){
    this.api.post(environment.ruta_lista, nombre).subscribe({
      next:(response:Lista[]) => {
        this.listas.set([]);
        this.listas.set(response);
      },
      error:((e)=>console.log("ERROR"))
    });
  }

  /**
   *
   * @param listaId
   */
  public deleteLista(listaId: number){
    const url = environment.ruta_lista + '/'
      + listaId;
    this.api.delete(url).subscribe({
      next:(response) => {
        this.listas.set([]);
        this.listas.set(response);
        console.log("Lista eliminada");
      },
      error:((e)=>console.log("ERROR"))
    });

    //this.actualizaListas();

  }

  /**
   * Añade una pelicula de una lista a otra
   * @param pl
   */
  public addPeliculoToLista(pl: PeliculaLista){
    this.api.post(environment.ruta_pelicula_lista, pl).subscribe({
      next:(response:Lista[]) => {
        this.listas.set([]);
        this.listas.set(response);
      },
      error:((e)=>console.log("ERROR"))
    });
  }

  /**
   *
   * @param pl
   */
  public deletePeliculaFromLista(pl:PeliculaLista){
    const url = environment.ruta_pelicula_lista + '/'
      + pl.listaId + '/' + pl.peliculaId;

    this.api.delete(url).subscribe({
      next:(response) => {
        this.listas.set([]);
        this.listas.set(response);

      },
      error:((e)=>console.log("ERROR"))
    });

    //this.actualizaListas();
  }

  /**
   * Devuelve los id de las listas donde está la pelicula
   * @param id
   */
  public getPeliculaLista(id: number):number[]{
    const numeros: number[] = [];
    this.listas().filter(lista =>{
        if(lista.peliculas.find(pelicula => pelicula.id === id))
          numeros.push(lista.id);
      }
    );
    return numeros;
  }

  public actualizaListas(){
    console.log("respuesta antes de actualizar");
    console.log(this.listas);
    const urlListas = environment.ruta_lista;
    console.log(urlListas);
    this.api.get(urlListas).subscribe({
      next:(response:Lista[]) => {
        this.listas.set([]);
        console.log("respuesta despues de actualizar");
        console.log(response);
        this.listas.set(response);
        console.log("listas despues de respuesta");
        console.log(this.listas);


      },
      error:((e)=>console.log("ERROR"))
    });
  }
}
