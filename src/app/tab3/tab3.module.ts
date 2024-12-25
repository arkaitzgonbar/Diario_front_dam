import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import {SearchComponentModule} from "../search/search.module";
import {MapComponentModule} from "../map/map.module";
import {DatosComponentModule} from "../datos/datos.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab3PageRoutingModule,
    SearchComponentModule,
    MapComponentModule,
    DatosComponentModule

  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
