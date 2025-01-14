import {Component, inject, OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { delay } from 'rxjs/operators';
import {PeliculaService} from "../servicios/pelicula.service";
import {CinesService} from "../servicios/cines.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  private peliculasSer = inject(PeliculaService);
  private cinesSer = inject(CinesService);

  peliculas: any[] = [];
  peliculasFiltradas: any[] = [];
  peliculasPaginadas: any[] = [];

  buscarTexto: string = '';
  generoSeleccionado: string = '';
  FechaLanzamiento: number | null = null;
  buscarReparto: string = '';

  paginaActual: number = 1;
  tamanoPagina: number = 25;
  totalPaginas: number = 0;
  paginaSeleccionada: number | null = null;

  isLoading: boolean = true;
  generos: string[] = [];

  constructor(private modal: ModalController) {}

  ngOnInit() {
    //this.cinesSer.loadCartelera();
    this.cargaPeliculas();
    //this.cargaCartelera();
    this.actualizarGeneros();

  }

  /**
   * Carga las peliculas en cartelera
   */
  cargaCartelera(){
    this.isLoading = true;
    this.peliculasSer.getCartelera().pipe(delay(0)).subscribe(data => {
      this.peliculasFiltradas = data;
      this.peliculasFiltradas.sort((a, b) => b.fechaEstreno - a.fechaEstreno);
      this.isLoading = false;
      this.paginaActual = 1;
      this.totalPaginas = Math.ceil(this.peliculasFiltradas.length / this.tamanoPagina);
      this.cargarPagina();
      console.log("Tamaño Peliculas filtradas: " + this.peliculasFiltradas.length);
      if (Array.isArray(this.peliculasFiltradas)) {
        console.log("Filtradas Es un array");
      } else {
        console.log("Filtradas No es un array");
      }
    }, error => {
      console.error("Error cargando cartelera", error);
      this.isLoading = false;
    });
  }

  /**
   * Carga TODAS las peliculas
   */
  cargaPeliculas() {
    this.isLoading = true;
    this.peliculasSer.getPeliculas().pipe(delay(0)).subscribe(data => {
      console.log('PELIS');
      console.log(data);
      this.peliculasFiltradas = data;
      this.peliculasFiltradas.sort((a, b) => b.fechaEstreno - a.fechaEstreno); //Ordena por el año, descendente
      console.log("Peliculas ordenadas");
      this.isLoading = false;
      this.paginaActual = 1;
      this.totalPaginas = Math.ceil(this.peliculasFiltradas.length / this.tamanoPagina);
      this.cargarPagina();
      if (Array.isArray(this.peliculasFiltradas)) {
        console.log("Filtradas Es un array");
      } else {
        console.log("Filtradas No es un array");
      }
      console.log("Tamaño Peliculas filtradas: " + this.peliculasFiltradas.length);
    }, error => {
      console.error("Error cargando películas", error);
      this.isLoading = false;
    });
  }

  aplicarFiltros() {
    if (this.buscarTexto || this.FechaLanzamiento || this.buscarReparto || this.generoSeleccionado) {
      this.isLoading = true;
      this.peliculasSer.buscarPeliculas(this.generoSeleccionado, this.buscarReparto, this.FechaLanzamiento, this.buscarTexto).pipe(delay(0)).subscribe(
        (response) => {
          this.peliculasFiltradas = response;
          this.peliculasFiltradas.sort((a, b) => b.fechaEstreno - a.fechaEstreno); //Ordena por el año, descendente
          console.log("Peliculas ordenadas");
          this.isLoading = false;
          this.paginaActual = 1;
          this.totalPaginas = Math.ceil(this.peliculasFiltradas.length / this.tamanoPagina);
          this.cargarPagina();
        },
        (error) => {
          console.error('Error en la búsqueda:', error);
        }
      );
    } else {
      this.cargaPeliculas();
    }
  }

  cargarPagina() {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    const fin = inicio + this.tamanoPagina;
    this.peliculasPaginadas = this.peliculasFiltradas.slice(inicio, fin);
    console.log("Peliculas paginadas: " + this.peliculasPaginadas);
    console.log("Tamaño peliculasPaginadas: " + this.peliculasPaginadas.length);
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.cargarPagina();
    }
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarPagina();
    }
  }

  irAPagina() {
    if (this.paginaSeleccionada && this.paginaSeleccionada >= 1 && this.paginaSeleccionada <= this.totalPaginas) {
      this.paginaActual = this.paginaSeleccionada;
      this.cargarPagina();
    }
  }

  estaEnCartelera(peliculaId: number):string{
    return this.cinesSer.findPeliculaById(peliculaId).toString();
  }

  actualizarGeneros() {
    this.peliculasSer.cargaGeneros().subscribe(
      (response) => {
        console.log("Respuesta: " + response);
        this.generos = response.sort();
        console.log("tamaño generos: " + this.generos.length);
        console.log("generos: " + this.generos);
        if (Array.isArray(this.generos)) {
          console.log("Genero Es un array");
        } else {
          console.log("Genero No es un array");
        }
      },
      (error) => {
        console.error('Error al obtener los géneros:', error);
      }
    );
  }

  async abrirModal(pelicula: any) {
    const modal = await this.modal.create({
      component: ModalPage,
      componentProps: { pelicula },
    });
    await modal.present();
  }
}
