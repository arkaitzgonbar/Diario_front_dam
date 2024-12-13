import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  constructor(private http: HttpClient) { }

  /**
   * Obtiene las coordenadas de un municipio utilizando Nominatim.
   * @param municipio Nombre del municipio.
   * @returns Observable con la respuesta de Nominatim.
   */
  getCoordinates(municipio: string): Observable<any> {
    const params = new HttpParams()
      .set('q', `${municipio}, Euskadi, España`)
      .set('format', 'json')
      .set('limit', '1');

    return this.http.get('https://nominatim.openstreetmap.org/search', { params });
  }

  /**
   * Busca cines cerca de unas coordenadas dentro de un radio especificado usando Overpass API.
   * @param lat Latitud.
   * @param lon Longitud.
   * @param radius Radio en metros.
   * @returns Observable con la respuesta de Overpass.
   */
  getNearbyCinemas(lat: number, lon: number, radius: number): Observable<any> {
    const query = `
      [out:json];
      (
        node["amenity"="cinema"](around:${radius},${lat},${lon});
        way["amenity"="cinema"](around:${radius},${lat},${lon});
        relation["amenity"="cinema"](around:${radius},${lat},${lon});
      );
      out center;
    `;

    const params = new HttpParams().set('data', query);

    return this.http.get('https://overpass-api.de/api/interpreter', { params });//Utilizamos la api pverpass para obtener los cines.
  }
/**
   * Métod que obtiene la posición actual del usuario utilizando la API de Geolocalización del navegador.
   * @returns Observable que emite las coordenadas del usuario o un error si no es posible obtenerlas.
   */
  getCurrentPosition(): Observable<GeolocationCoordinates> {
    return new Observable((observer) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('GeoLocation');
            observer.next(position.coords);
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocation is not available in this browser.');
      }
    });
  }
}
