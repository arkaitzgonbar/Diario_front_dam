import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {MostrarPeliculaCinesComponent} from "./mostrar-pelicula-cines.component";

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [MostrarPeliculaCinesComponent],
  exports: [MostrarPeliculaCinesComponent]
})
export class MostrarPeliculaCinesComponentModule {}
