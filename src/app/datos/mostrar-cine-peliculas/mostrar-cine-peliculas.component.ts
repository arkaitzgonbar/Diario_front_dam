import {Component, input, OnInit} from '@angular/core';

@Component({
  selector: 'app-mostrar-cine-peliculas',
  templateUrl: './mostrar-cine-peliculas.component.html',
  styleUrls: ['./mostrar-cine-peliculas.component.scss'],
})
export class MostrarCinePeliculasComponent{
  datos = input.required<any>();
  constructor() { }



}
