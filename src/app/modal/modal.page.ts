import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { CargarPelisService } from '../Servicios/cargar-pelis.service';
import { ClasificacionService } from '../Servicios/clasificacion.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage{
  @Input() pelicula: any;
  ListasClasificacion: any[] = [];
  
  valoracionMedia: number = 0;
  numeroValoraciones: number = 0;
  stars: string[] = [];

  //VAriable para controlar los géneros
  verGeneros: boolean = false;

  constructor(private alertController: AlertController,private modalController: ModalController, private clasificacion: ClasificacionService,private router : Router, private carga : CargarPelisService) {}

  ngOnInit() {
    this.actualizarClasificaciones();
    this.obtenerValoracion();
  }
  actualizarClasificaciones() {
    this.ListasClasificacion = this.clasificacion.obtenerClasificaciones();
  }

  clasificarPelicula(clasificacion: string) {
    this.clasificacion.clasificar(this.pelicula, clasificacion);
    this.modalController.dismiss();
  }
  
  cerrar() {
    this.modalController.dismiss();
  }
  toggleGeneros() {
    this.verGeneros = !this.verGeneros;
  }

  abrirGeolocalizacion(titulo : String) {
    this.carga.setTituloPeliculaSeleccionada(this.pelicula.titulo);
    this.router.navigate(['/mi-app/cines-cercanos']); 
    this.modalController.dismiss(); 
  }


  obtenerValoracion() {
    const valoracion = this.clasificacion.obtenerValoracion(this.pelicula.id);
    if (valoracion) {
      this.valoracionMedia = parseFloat(valoracion.media.toFixed(2));
      this.numeroValoraciones = valoracion.total;
      this.actualizarEstrellas();
    }
  }

  actualizarEstrellas() {
    
    const estrellasLlenas = Math.round(this.valoracionMedia);
    this.stars = [];
  
    for (let i = 0; i < 5; i++) {
      if (i < estrellasLlenas) {
        this.stars.push('star');
      } else {
        this.stars.push('star-outline');
      }
    }
  }

  async valorarPelicula() {
    const alert = await this.alertController.create({
      header: 'Introduce tu valoración',
      message: 'Por favor, introduce un número entre 0 y 5.',
      inputs: [
        {
          name: 'valoracion', 
          type: 'number',     
          min: 0,             
          max: 5,             
          placeholder: 'Valoración', 
        },
      ],
      buttons: [
        {
          text: 'Cancelar', 
          role: 'cancel',   
          handler: () => {
            console.log('Valoración cancelada');
          },
        },
        {
          text: 'Aceptar', 
          handler: (data) => {
            const valor = parseFloat(data.valoracion);

            if (!isNaN(valor) && valor >= 0 && valor <= 5) {
              this.clasificacion.guardarValoracion(this.pelicula.id, valor);
              this.obtenerValoracion(); 
            } else {
              
              this.mostrarErrorValoracion(); 
            }
          },
        },
      ],
    });

    
    await alert.present(); 
  }

  
  async mostrarErrorValoracion() {
    const errorAlert = await this.alertController.create({
      header: 'Error',
      message: 'Por favor, introduce un número válido entre 0 y 5.',
      buttons: ['OK'],
    });

    await errorAlert.present(); 
  }
}
