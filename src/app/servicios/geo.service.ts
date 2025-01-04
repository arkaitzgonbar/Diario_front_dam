import { HttpClient, HttpParams } from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {Observable, map} from 'rxjs';
import {Point} from "ol/geom";
import {Coordinate} from "ol/coordinate";
import {transform} from "ol/proj";
import {RouteData} from "../mis-interfaces/ruta";

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  private http= inject(HttpClient);
  private ubicacion =signal<Coordinate|undefined>(undefined);

  public updateLocalizacion(loc:Coordinate|undefined){
    this.ubicacion.set(loc);
  }


  /**
   *
   * @param posicion
   * @param cine
   */
  ruta(posicion:Coordinate, cine:Coordinate):Observable<string>{
    posicion =transform(posicion, 'EPSG:3857', 'EPSG:4326');
    return  this.http
      .get<RouteData>(
        'https://router.project-osrm.org/route/v1/driving/'+posicion+
        ';'+cine+'?overview=full&geometries=polyline&steps=true&generate_hints=false'
      ).pipe(
        map(data => data.routes[0].geometry)
      );
  }
}
