import { Component, Input, OnInit } from '@angular/core';
import { ClasificacionService } from '../servicios/clasificacion.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { NuevaClasificacionPage } from '../nueva-clasificacion/nueva-clasificacion.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  clasificaciones: string[] = []; // Lista de clasificaciones disponibles
  peliculas: any[] = []; // Lista de películas clasificadas
  segmentoSeleccionado: string = ''; // Clasificación seleccionada actualmente

  constructor(
    private clasificacionService: ClasificacionService,
    private modal: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.actualizarClasificaciones();
  }

  /**
   * Método para obtiener las clasificaciones desde el servicio y filtra las películas por clasificación actual.
   */
  actualizarClasificaciones() {
    this.clasificaciones = this.clasificacionService.obtenerClasificaciones();
    this.filtrarPeliculasPorClasificacion();
  }

  /**
   * Método que clasifica una película bajo una categoría específica.
   * @param pelicula Película que será clasificada.
   * @param clasificacion Clasificación a aplicar.
   */
  clasificarPelicula(pelicula: any, clasificacion: string) {
    // Clasificar la película usando el servicio
    this.clasificacionService.clasificar(pelicula, clasificacion);
    // Recargar las películas clasificadas
    this.obtenerPeliculasClasificadas();
  }

  /**
   * Método para filtrar las películas por la clasificación actualmente seleccionada.
   */
  filtrarPeliculasPorClasificacion() {
    if (this.segmentoSeleccionado) {
      // Obtener las películas clasificadas bajo la categoría seleccionada
      this.peliculas = this.clasificacionService.obtenerClasificadas(this.segmentoSeleccionado);
    } else {
      // Si no hay categoría seleccionada, limpiar la lista
      this.peliculas = [];
    }
  }

  /**
   * Método que elimina una película específica de la lista actual y del servicio.
   * @param index Índice de la película a eliminar.
   */
  eliminarPelicula(index: number) {
    if (index >= 0 && index < this.peliculas.length) {
      this.peliculas = this.peliculas.filter((_, i) => i !== index);
      // Elimina la película de la clasificación correspondiente en el servicio
      this.clasificacionService.eliminarPeliculaDeClasificacion(this.segmentoSeleccionado, index);
    }
  }

  /**
   * Método que cambia el segmento seleccionado y actualiza las películas clasificadas.
   * @param event Evento que contiene el nuevo valor del segmento seleccionado.
   */
  cambioSegmento(event: any) {
    this.segmentoSeleccionado = event.detail.value;
    this.obtenerPeliculasClasificadas();
  }

  /**
   * Método para obtener las películas clasificadas bajo la clasificación seleccionada.
   */
  obtenerPeliculasClasificadas() {
    this.peliculas = this.clasificacionService.obtenerClasificadas(this.segmentoSeleccionado);
  }

  /**
   * Método que abre un alertController para agregar una nueva clasificación.
   */
  async abrirAgregarClasificacion() {
    const alert = await this.alertController.create({
      header: 'Agregar Clasificación',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'nuevaClasificacion',
          type: 'text',
          placeholder: 'Escribe una clasificación...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            const nuevaClasificacion = data.nuevaClasificacion?.trim();
            if (nuevaClasificacion) {
              // Agregar la nueva clasificación al servicio
              this.clasificacionService.agregarClasificacion(nuevaClasificacion);
              this.actualizarClasificaciones(); // Actualizar la lista
              return true;
            } else {
              return false; // No guardar si el texto está vacío
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   *  Método que abre un alertController para eliminar una clasificación existente.
   */
  async abrirEliminarClasificacion() {
    const alert = await this.alertController.create({
      header: 'Eliminar clasificación',
      cssClass: 'custom-alert',
      inputs: this.clasificaciones.map(clasificacion => ({
        type: 'radio',
        label: clasificacion,
        value: clasificacion
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: (clasificacion: string) => {
            if (clasificacion) {
              // Llama al método para eliminar la clasificación
              this.eliminarClasificacion(clasificacion);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Método que elimina una clasificación específica del servicio y actualiza la lista.
   * @param clasificacion Clasificación a eliminar.
   */
  eliminarClasificacion(clasificacion: string) {
    this.clasificacionService.eliminarClasificacion(clasificacion);
    this.actualizarClasificaciones();
  }
}
