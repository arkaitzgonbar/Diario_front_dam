import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {MostrarCinePeliculasComponent} from "./mostrar-cine-peliculas.component";

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [MostrarCinePeliculasComponent],
  exports: [MostrarCinePeliculasComponent]
})
export class MostrarCinePeliculasComponentModule {}
