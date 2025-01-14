import { PeliculaLista } from './../mis-interfaces/pelicula';
import {Component, inject, Input, input, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {AlertController, ModalController} from '@ionic/angular';
import {Pelicula, Valoracion} from "../mis-interfaces/pelicula";
import {PeliculaService} from "../servicios/pelicula.service";
import {ListaService} from "../servicios/lista.service";
import {Lista} from "../mis-interfaces/lista";
import {DatosService} from "../servicios/datos.service";
import {DataType} from "../mis-interfaces/enums";
import {CinesService} from "../servicios/cines.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements  OnInit{
  peliculaSer = inject(PeliculaService);
  listSer = inject(ListaService);
  datosSer = inject(DatosService);
  cinesSer = inject(CinesService);

  @Input() pelicula: any;

  //Array de generos para hacer el toglebar
  listaGeneros: string[] = [];

  //pelicula = input.required<Pelicula>();
  listas = signal<Lista[]>([]);
  valoracion = signal<Valoracion|undefined>(undefined);
  listaSeleccionada = signal<number[]>([]);
  enCartelera = signal<boolean>(false);
  //ListasClasificacion: any[] = [];

  estaVotado: boolean = false;
  //valoracionMedia: number = 0;
  //numeroValoraciones: number = 0;
  stars: string[] = []; // Array que representa visualmente las estrellas de valoración
  verGeneros: boolean = false; // Controla si se muestran todos los géneros de la película

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private router: Router
  ) {
    //this.peliculaSer.loadListasPelicula(this.pelicula.id);

  }

  ngOnInit() {
    this.listSer.loadListas();
    this.cinesSer.loadCartelera();
    this.peliculaSer.loadValoracion(this.pelicula.id);
    this.enCartelera.set(
      this.cinesSer.findPeliculaById(this.pelicula.id)
    );
    this.listSer.listas$.subscribe({
      next:(response) => {
        this.listas.set(response);
        this.listaSeleccionada.set(
          this.listSer.getPeliculaLista(this.pelicula.id)
        );
      }
    });

    this.peliculaSer.valoracion$.subscribe({
      next:(response) => {
        this.valoracion.set(response);
        this.actualizarEstrellas();

        // Comprueba si la pelicula ha sido votada por el usuario
        if(response?.votado){
          this.estaVotado = true;
        }else{
          this.estaVotado = false;
        }
        console.log("Esta votado: " + this.estaVotado);
      }
    });
  }

  /**
   * Método que actualiza la lista de clasificaciones desde el servicio
   *
   */
  actualizarClasificaciones() {
    //this.ListasClasificacion = this.clasificacion.obtenerClasificaciones();
  }

  /**
   * Método que clasifica la película en la categoría seleccionada y cierra el modal
   *
   */
  addALista(listaId: number) {
    this.listSer.addPeliculoToLista({
      listaId: listaId,
      peliculaId: this.pelicula.id
    });
    //this.clasificacion.clasificar(this.pelicula, clasificacion);
    //this.modalController.dismiss();
  }

  /**
   * Método que clasifica la película en la categoría seleccionada y cierra el modal
   *
   */
  removeDeLista(listaId: number) {
    this.listSer.deletePeliculaFromLista({
      listaId: listaId,
      peliculaId: this.pelicula.id
    });
    //this.clasificacion.clasificar(this.pelicula, clasificacion);
    //this.modalController.dismiss();
  }

  /**
   * Método que cierra el modal sin realizar ninguna acción adicional
   *
   */
  cerrar() {
    this.modalController.dismiss();
  }

  /**
   * Método que alterna entre mostrar todos los géneros de la película o solo los primeros
   *
   */
  toggleGeneros() {
    this.verGeneros = !this.verGeneros;
  }

  /**OK
   * Metodo que abre la página de geolocalización, configurando primero el título de la película seleccionada
   *
   */
  abrirGeolocalizacion() {
    this.datosSer.updateData(this.cinesSer.mostrarCinesByPelicula(this.pelicula.titulo));
    this.datosSer.updateMostrar(DataType.pelicula);
    this.cinesSer.updateCartelera(
      this.cinesSer.getCinesByPelicula(this.pelicula.titulo)
    );

    this.router.navigate(['/mi-app/cines-cercanos']);
    this.modalController.dismiss();
  }

  /**
   * Metodo que obtiene la valoración promedio y el número total de valoraciones desde el servicio
   *
   */
  obtenerValoracion() {
    // const valoracion = this.clasificacion.obtenerValoracion(this.pelicula.id);
    // if (valoracion) {
    //   // Redondea la valoración media a dos decimales y actualiza la visualización de estrellas
    //   this.valoracionMedia = parseFloat(valoracion.media.toFixed(2));
    //   this.numeroValoraciones = valoracion.total;
    //   this.actualizarEstrellas();
    // }
  }

  /**
   * Metodo que genera un array de estrellas (llenas y vacías) basado en la valoración media
   *
   */
  actualizarEstrellas() {
    if(this.valoracion()){
      const estrellasLlenas = Math.round(this.valoracion()!.puntuacion);
      this.stars = []; // Limpia el array actual de estrellas

      // Bucle que llena el array con estrellas llenas hasta alcanzar la valoración media
      for (let i = 0; i < 5; i++) {
        if (i < estrellasLlenas) {
          this.stars.push('star'); // Estrella llena
        } else {
          this.stars.push('star-outline'); // Estrella vacía
        }
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
          min: 0, // Valor mínimo permitido
          max: 5, // Valor máximo permitido
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
            const valor = parseFloat(data.valoracion); // Convierte la entrada a un número float

            // Condición que valida que la valoración esté entre 0 y 5
            if (!isNaN(valor) && valor >= 0 && valor <= 5) {
              this.peliculaSer.addValoracion({
                peliculaId: this.pelicula.id,
                puntuacion: valor,
                votado:true
              });
              //this.clasificacion.guardarValoracion(this.pelicula.id, valor); // Guarda la valoración en el servicio
              //this.obtenerValoracion(); // Actualiza la valoración y la visualización de estrellas
            } else {
              this.mostrarErrorValoracion(); // Muestra un mensaje de error si la valoración no es válida
            }
          },
        },
      ],
    });

    await alert.present();
  }


  async alertaVotado() {
    console.log("ALertaVotado ejecutado")
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: 'No puedes votar porque ya has votado esta película.',
      buttons: ['OK']
    });
    await alert.present();
  }
  /**
   * Método que muestra un mensaje de error cuando la valoración introducida no es válida
   *
   */
  async mostrarErrorValoracion() {
    const errorAlert = await this.alertController.create({
      header: 'Error',
      message: 'Por favor, introduce un número válido entre 0 y 5.',
      buttons: ['OK'],
    });

    await errorAlert.present();
  }
}
