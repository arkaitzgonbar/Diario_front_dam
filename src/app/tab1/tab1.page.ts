import { Component, OnInit } from '@angular/core';
import { CargarPelisService } from '../servicios/cargar-pelis.service';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  // Todas las películas obtenidas del JSON/API
  peliculas: any[] = [];
  // Películas tras aplicar filtros
  peliculasFiltradas: any[] = [];
  // Películas correspondientes a la página actual
  peliculasPaginadas: any[] = [];

  // Variables para filtrar las películas
  buscarTexto: string = ''; // Texto de búsqueda para filtrar por título
  generoSeleccionado: string = ''; // Género seleccionado
  FechaLanzamiento: number | null = null; // Año de lanzamiento
  buscarReparto: string = '';

  // Variables para la paginación
  paginaActual: number = 1; // Página actual
  tamanoPagina: number = 25; // Cantidad de películas por página
  totalPaginas: number = 0; // Total de páginas calculadas

  isLoading: boolean = true; // Flag para el spin de carga
  generos: string[] = []; // Lista de géneros disponibles

  constructor(private cargar: CargarPelisService, private modal: ModalController) {}//Injectamos el servicio y modal controler para el modal

  /**
   * El método ngOnInit carga las películas y prepara la lista de géneros.
   */
  ngOnInit() {
    this.cargaPeliculas();

  }

  /***
   * Carga TODAS las peliculas y la lista de los distintos generos
   */
  cargaPeliculas(){
    this.isLoading = true;// Activa la barra de carga
    this.cargar.getPeliculas().pipe(delay(0)).subscribe(data => {//delay para retrasar artificialmente
      //this.peliculas = data;
      //this.aplicarFiltros(); // Aplicar filtros iniciales
      this.peliculasFiltradas = data;
      this.actualizarGeneros(); // Crear la lista de géneros
      this.isLoading = false; // Finalizar la carga

       // Actualizar la paginación
       // Calcular el número total de páginas
       this.paginaActual = 1; // Reiniciar a la primera página
       this.totalPaginas = Math.ceil(this.peliculasFiltradas.length / this.tamanoPagina);
       this.cargarPagina();
    }, error => {
      console.error("Error cargando películas", error);
      this.isLoading = false;
    });
  }
  /**
   * Método que aplica los filtros de búsqueda, género y año de lanzamiento sobre las películas,
   * y actualiza la paginación.
   */

 /*
  aplicarFiltros() {

    //Comprueba si el array tiene carga ARKAITZ
    if (!this.peliculas || this.peliculas.length === 0) {
      console.error('No hay películas disponibles para filtrar.');
      return; // Salir del método si no hay datos.
    }
    console.log("Texto: " + this.buscarTexto + " Genero: " + this.generoSeleccionado + " AÑO: " + this.FechaLanzamiento);

    let resultado = [...this.peliculas]; // Copiar la lista de películas

    // Filtro por título
    /*if (this.buscarTexto.trim()) {
      resultado = resultado.filter(peli =>
        peli.titulo.toLowerCase().includes(this.buscarTexto.toLowerCase())
      );
    }*/
/*
    if (this.buscarTexto.trim()) {
      resultado = resultado.filter(peli =>
        peli.titulo && peli.titulo.toLowerCase().includes(this.buscarTexto.toLowerCase())
      );
    }

    // Filtro por género
    if (this.generoSeleccionado) {
      resultado = resultado.filter(peli =>
        peli.generos && peli.generos.includes(this.generoSeleccionado)
      );
    }

    // Filtro por año de lanzamiento
    if (this.FechaLanzamiento) {
      resultado = resultado.filter(peli =>
        //peli.fechaLanzamiento == this.FechaLanzamiento
        peli.fechaEstreno == this.FechaLanzamiento //Cambio
      );
    }

    // Asignar las películas filtradas
    this.peliculasFiltradas = resultado;

    // Calcular el número total de páginas
    this.paginaActual = 1; // Reiniciar a la primera página
    this.totalPaginas = Math.ceil(this.peliculasFiltradas.length / this.tamanoPagina);

    // Actualizar la paginación
    this.cargarPagina();
  }*/


    aplicarFiltros() {
      this.isLoading = true;
      if(this.buscarTexto !== "" || this.FechaLanzamiento !== null|| this.buscarReparto !== "" || this.generoSeleccionado !== ""){
        this.cargar.buscarPeliculas(this.generoSeleccionado, this.buscarReparto, this.FechaLanzamiento, this.buscarTexto).pipe(delay(0)).subscribe(
          (response) => {

            this.peliculasFiltradas = response; // Asignamos los datos al array `generos` ordenados

            console.log("Busqueda correcta");
            console.log(this.peliculasFiltradas);
            console.log("Texto: " + this.buscarTexto + " Genero: " + this.generoSeleccionado + " AÑO: " + this.FechaLanzamiento);

            this.isLoading = false;
            // Actualizar la paginación
            // Calcular el número total de páginas
            this.paginaActual = 1; // Reiniciar a la primera página
            this.totalPaginas = Math.ceil(this.peliculasFiltradas.length / this.tamanoPagina);
            this.cargarPagina();
          },
          (error) => {
            console.error('Error en la busqueda:', error);
          }
        );
      }else{
        this.cargaPeliculas();
      }
    }


  /**
   * Método que actualiza la lista de películas para mostrar en la página actual.
   */
  cargarPagina() {

    const inicio = (this.paginaActual - 1) * this.tamanoPagina; // Índice inicial
    const fin = inicio + this.tamanoPagina; // Índice final

    // Seleccionar las películas de la página actual
    this.peliculasPaginadas = this.peliculasFiltradas.slice(inicio, fin);
  }

  /**
   * Método que sirve para cambiar a la página siguiente, si existe.
   */
  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.cargarPagina();
    }
  }

  /**
   * Método que sirve para cambiar a la página anterior, si existe.
   */
  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarPagina();
    }
  }

  /**
   *Método que utiliza el servicio para recibir una lista de generos de la API.
   */
   actualizarGeneros() {
    this.cargar.cargaGeneros().subscribe(
      (response) => {
        this.generos = response.sort(); // Asignamos los datos al array `generos` ordenados
        console.log("Generos cargados correctamente")
      },
      (error) => {
        console.error('Error al obtener los géneros:', error);
      }
    );
  }

  /**
   * Método que abre un modal con detalles de una película específica.
   * @param pelicula Objeto que contiene la información de la película.
   */
  async abrirModal(pelicula: any) {
    const modal = await this.modal.create({
      component: ModalPage,
      componentProps: { pelicula },
    });
    await modal.present();
  }
}
