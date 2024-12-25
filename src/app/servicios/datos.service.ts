import {Injectable, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {DataType} from "../mis-interfaces/enums";

@Injectable({
  providedIn: 'root',
})
export class DatosService {
  private mostrar = signal<DataType>(DataType.nada);
  private data = signal<any>(null);
  soloPeliculas = signal<boolean>(false);

  mostrar$ = toObservable(this.mostrar);
  data$ = toObservable(this.data);



  public updateMostrar(mostrar:DataType){
    this.mostrar.set(mostrar);
  }
  public updateData(data: any){
    this.data.set(data);
  }
}
