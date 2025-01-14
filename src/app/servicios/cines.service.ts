import {inject, Injectable, signal} from '@angular/core';
import {DatePipe} from "@angular/common";
import {CineCart, Cines, PeliculaCines} from "../mis-interfaces/cartelera";
import {toObservable} from '@angular/core/rxjs-interop';
import {ApiService} from "./api.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class CinesService {
  private api = inject<ApiService>(ApiService);
  private datePipe = new DatePipe('en-US');

  private cartelera= signal<CineCart[]>([]);
  private todosCines = signal<CineCart[]>([]);
  private peliculas =signal<string[]>([]);

  cartelera$ = toObservable(this.cartelera);
  allPeliculas = this.peliculas.asReadonly();



  /**
   * Carga la cartelera del almacenamiento local, sino es del mismo dia la pide de nuevo
   */
  public loadCartelera(){
    this.api.get<Cines>(environment.ruta_cine)
      .subscribe({
        next:((data:Cines) =>{
          this.todosCines.set(data.cines);
          this.updateCartelera(data.cines);
          //localStorage.setItem('cartelera', JSON.stringify(data));
        }),
        error:((e)=>console.log(e))
      });
  }


  /**
   * Obtiene la lista de peliculas de los cines, sin repeticiones
   * @private
   */
  public obtenerPeliculas(){
    const pelis: string[] =[];
    console.log('this.cartelera()');
    console.log(this.cartelera());
    this.cartelera().forEach(cine =>{
      cine.peliculas.forEach(pelicula =>{
        if(pelis.indexOf(pelicula.titulo) === -1)
          pelis.push(pelicula.titulo);
      });
    });
    this.peliculas.set(pelis);
  }

  public updateCartelera(cartelera: CineCart[]){
    console.log('UPDATE');
    console.log(cartelera);
    this.cartelera.set(cartelera);
  }

  /**
   * Actualiza los cines con peliculas
   * @param value
   */
  public updateConPeliculas(value:boolean) {
    if(!value)
      this.cartelera.set(this.todosCines());
    else{
      const cines: CineCart[] = [];
      this.cartelera().forEach(cine =>{
        if(cine.peliculas.length > 0)
          cines.push(cine);
      });
      this.cartelera.set(cines);
    }
  }

  /**
   * Dado el id de un cine busca sus datos
   * @param id
   */
  public getCineByid(id:number):CineCart| undefined{
    return this.cartelera().find((cine) => cine.id === id);
  }

  /**
   * Dado el titulo de una pelicula devuelve los cines y los horarios en los que esta
   * @param titulo
   */
  public mostrarCinesByPelicula(titulo: string): PeliculaCines{
    let pelicula: PeliculaCines= undefined;

    this.cartelera().forEach(cine =>{
      const peli = cine.peliculas
        .find((p) => p.titulo === titulo);

      if(peli){
        if(!pelicula){
          pelicula = {
            id: peli?.id,
            titulo: peli?.titulo,
            imagen: peli?.imagen,
            altoImagen: peli?.altoImagen,
            anchoImagen: peli?.altoImagen,
            cines:[]
          }
        }
        //Añade los horarios de la pelicula en el cine
        pelicula.cines.push({nombre: cine.nombre, horarios: peli.horario});
      }
    });
    return  pelicula;
  }

  /**
   * Dado el titulo de una pelicula devuelve los cines en los que está
   * @param titulo
   */
  public getCinesByPelicula(titulo: string): CineCart[]{
    return this.cartelera().filter(cine =>
      cine.peliculas.find(pelicula => pelicula.titulo === titulo)
    );
  }

  /**
   * Dado un string busca los 4 primeros nombres de peliculas que lo contienen
   * @param word
   * @returns array de string
   */
  filmsWithWords(word:string): string[]{
    const values: string[] = [];
    if(this.peliculas().length===0)
      this.obtenerPeliculas();
    if(word == '')
      return values;
    for (let element of this.peliculas()) {
      if(element.toLowerCase().startsWith(word.toLowerCase())){
        values.push(element);
        if(values.length >= 4)
          break
      }
    }
    return values;
  }

  /**
   * Dado un string busca si es el titulo de una pelicula
   * @param pelicula
   */
  public  findPeliculaByName(pelicula:string): boolean{
    return this.peliculas().includes(pelicula);
  }

  /**
   *
   * @param peliculaId
   */
  public findPeliculaById(peliculaId: number){
    const finded =  this.todosCines().find(cine =>
      cine.peliculas.find(pelicula => pelicula.id === peliculaId)
    )
    return finded ? true : false;
  }



}
