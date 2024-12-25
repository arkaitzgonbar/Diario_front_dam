import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import {SearchComponent} from "./search.component";

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [SearchComponent],
  exports: [SearchComponent]
})
export class SearchComponentModule {}
