import {AfterViewInit, Component, OnInit, OnDestroy, inject, signal} from '@angular/core';
//import { latLng, tileLayer, Map, marker, icon, Layer, LatLngBounds } from 'leaflet';
//import * as L from 'leaflet';
import { GeoService } from '../servicios/geo.service';
import {DatosService} from "../servicios/datos.service";
import {CinesService} from "../servicios/cines.service";
import Zoom from "ol/control/Zoom";
import {View, Map} from "ol";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {Layer} from "ol/layer";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
/*
  map!: Map;
  lat: number = 43.0000;
  lng: number = -2.0000;

  municipios: string[] = ['Bilbao', 'Vitoria-Gasteiz', 'Donostia-San Sebastián', 'Barakaldo', 'Getxo', 'Irun', 'Portugalete', 'Santurtzi', 'Errenteria', 'Basauri', 'Posición Actual'];

  // Opciones de distancia
  distancias: number[] = [1000, 5000, 10000, 20000];
  selectedMunicipio: string = ''; // Municipio seleccionado
  selectedDistancia!: number; // Distancia seleccionada
  cines: any[] = []; // Almacena la lista de cines
  public movies: Cartelera[] = []; // Array donde almacenaremos las películas
  public movieTitles: string[] = []; // Array donde almacenaremos los títulos de las películas
  selectedMovieTitle: string = '';

  // Configuración del mapa
  options: any;
  layers: Layer[] = [];

  constructor(private osm: GeoService, private carga : CargarPelisService) { }

  ngOnInit(): void {
    //this.loadMovies(); //método para cargar las peliculas y sus cines
    this.selectedMovieTitle = this.carga.getTituloPeliculaSeleccionada();
    console.log("pelicula seleccionada" + this.selectedMovieTitle);
  }

  ionViewWillEnter(): void {
    // reseteamos valores
    this.selectedMovieTitle = this.carga.getTituloPeliculaSeleccionada();
    if (!this.movieTitles.includes(this.selectedMovieTitle)) {
      this.movieTitles.push(this.selectedMovieTitle);
    }
    this.selectedMunicipio = '';
    this.selectedDistancia = undefined!;
    this.cines = [];
    this.initMap();
  }

  // Método para crear nuevo mapa
  initMap(): void {
    this.map = new Map({
      target: 'mapa',

      controls:[new Zoom()],
      view: new View({
        center:[-297572.2948370609, 5288707.104109812],
        zoom: 10
      }),
      layers: [new TileLayer({source: new OSM()})]
    });
  }

*/

}
