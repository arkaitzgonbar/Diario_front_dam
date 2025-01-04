import {Component, inject, signal} from '@angular/core';
import {CinesService} from "../servicios/cines.service";
import {DatosService} from "../servicios/datos.service";
import {DataType} from "../mis-interfaces/enums";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  private cinesSer = inject(CinesService);
  //private store = inject(Store<{selectedStates:string[]}>);
  private datosSer = inject(DatosService);
  pelisOptions = signal<string[]>([]);


  onReset(){

    this.datosSer.updateMostrar(DataType.nada);
    this.cinesSer.updateConPeliculas(this.datosSer.soloPeliculas());

  }
  /**
   * A medida que escribe una letra va cambiando las opciones a elegir
   * @param pelicula
   */
  onWrite(pelicula:HTMLInputElement){
    console.log(this.cinesSer.allPeliculas());
    console.log(this.cinesSer.filmsWithWords(pelicula.value));
    this.pelisOptions.set(this.cinesSer.filmsWithWords(pelicula.value));
  }

  /**
   * Al click en una de las opciones de la busqueda cambia el texto del input
   * y llama al submit
   * @param pelicula
   * @param input
   */
  onSelect(pelicula: string, input: HTMLInputElement){
    input.value = pelicula;
    this.onSubmit(input);
  }

  /**
   * Si el texto del input existe lo selecciona en la lista de estados
   * @param pelicula
   */
  onSubmit(input: HTMLInputElement){
    this.pelisOptions.set([]);
    const pelicula = input.value;
    if(this.cinesSer.findPeliculaByName(pelicula)){
      console.log(this.cinesSer.getCinesByPelicula(pelicula));
      this.cinesSer.updateCartelera(this.cinesSer.getCinesByPelicula(pelicula));
      this.datosSer.updateMostrar(DataType.pelicula);
      this.datosSer.updateData(this.cinesSer.mostrarCinesByPelicula(pelicula));
      input.value = '';
    }

  }

  /**OK
   * Si la tecla presionada es enter llama a onSubmit
   * @param event
   * @param pelicula
   */
  onKeypress(event: { key: any; }, pelicula:HTMLInputElement){
    if(event.key === 'Enter')
      this.onSubmit(pelicula);
  }
}
