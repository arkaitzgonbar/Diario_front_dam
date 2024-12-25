import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CinesService} from "../servicios/cines.service";
import {DatosService} from "../servicios/datos.service";
import {DataType} from "../mis-interfaces/enums";

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.scss'],
})
export class DatosComponent  implements OnInit {
  private datosSer = inject(DatosService);
  private cineSer = inject(CinesService);
  protected readonly DataType = DataType;
  datos = signal<any>(null);
  //pelicula = computed(()=>this.cineSer.peliculaSeleccionada());
  //cine = computed(()=>this.cineSer.cine());
  mostrar = signal<DataType>(DataType.nada);
  soloCinesConPeliculas = signal<boolean>(false);

  constructor() { }

  ngOnInit() {
    this.datosSer.mostrar$.subscribe({
      next: (data) => this.mostrar.set(data)
    });
    this.datosSer.data$.subscribe({
      next: (data) => this.datos.set(data)
    });
  }

  onClick(){
    this.soloCinesConPeliculas.set(! this.soloCinesConPeliculas());
    this.cineSer.updateConPeliculas(this.soloCinesConPeliculas());
    this.datosSer.soloPeliculas.set(this.soloCinesConPeliculas());

  }


}
