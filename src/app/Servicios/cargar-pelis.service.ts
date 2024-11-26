import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pelicula } from '../mis-interfaces/pelicula';
import { Cartelera } from '../mis-interfaces/cartelera';

@Injectable({
  providedIn: 'root'
})
export class CargarPelisService {

  private jsonUrl = '/assets/movies-2020s-con-enCartel.json'; //Url para cargar el json de las películas. Habrá que sustituirlo por url api.
  private jsonUrlCartelera = 'assets/pelis.json'; // Ruta al archivo JSON
  public movies: Cartelera[] = [];
  private tituloPeliculaSeleccionada: string = '';

  constructor(private http: HttpClient) { }

  // Obtenemos todas las películas desde el json/api
  getPeliculas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.jsonUrl);
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
  filtrarPorGeneros(peliculas: Pelicula[], genero: string): Pelicula[] {
    return peliculas.filter(pelicula => 
     pelicula.generos.some(g => g.toLowerCase() === genero.toLowerCase())
    );
  }

  // Método para filtrar películas por año de lanzamiento
  filtrarPorFechaEstreno(peliculas: Pelicula[], fechaEstreno: number): Pelicula[] {
    return peliculas.filter(pelicula => pelicula.fechaEstreno === fechaEstreno);
  }

  // Método para obtener la cartelera falsa del Json
  getCartelera(): Observable<Cartelera[]> {
    return this.http.get<Cartelera[]>(this.jsonUrlCartelera);
  }

}
