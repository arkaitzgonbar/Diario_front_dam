import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {DatosComponent} from "./datos.component";
import {MostrarCinePeliculasComponentModule} from "./mostrar-cine-peliculas/mostrar-cine-peliculas.module";
import {MostrarPeliculaCinesComponentModule} from "./mostrar-pelicula-cines/mostrar-pelicula-cines.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MostrarCinePeliculasComponentModule, MostrarPeliculaCinesComponentModule],
  declarations: [DatosComponent],
  exports: [DatosComponent]
})
export class DatosComponentModule {}
