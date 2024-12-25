import {Component, input, OnInit} from '@angular/core';

@Component({
  selector: 'app-mostrar-pelicula-cines',
  templateUrl: './mostrar-pelicula-cines.component.html',
  styleUrls: ['./mostrar-pelicula-cines.component.scss'],
})
export class MostrarPeliculaCinesComponent {
  datos = input.required<any>();
  constructor() { }




}
