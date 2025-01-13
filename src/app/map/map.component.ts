import {Component, inject, OnInit, signal} from '@angular/core';
import {CinesService} from "../servicios/cines.service";
//import {Store} from "@ngrx/store";
import {DatosService} from "../servicios/datos.service";
import {GeoService} from "../servicios/geo.service";
import {Feature, Geolocation, Map, View} from "ol";
import VectorLayer from "ol/layer/Vector";
import {OSM, Vector} from "ol/source";
import Toggle from "ol-ext/control/Toggle";
import Bar from "ol-ext/control/Bar";
import Zoom from "ol/control/Zoom";
import TileLayer from "ol/layer/Tile";
import {Point} from "ol/geom";
import Style from "ol/style/Style";
import {Fill, Icon, Stroke} from "ol/style";
import {Polyline} from "ol/format";
import VectorSource from "ol/source/Vector";
import CircleStyle from "ol/style/Circle";
import {transform} from "ol/proj";
import {DataType} from "../mis-interfaces/enums";
import Hover from "ol-ext/interaction/Hover";
import {CineCart} from "../mis-interfaces/cartelera";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent  implements OnInit {
  private cineSer =inject(CinesService);
  private datosSer = inject(DatosService);
  private geoSer = inject(GeoService);
  map!: Map;
  layer!: VectorLayer;
  routeLayer !: VectorLayer| undefined;
  vector!:Vector;
  location!: Feature;
  geolocation!:Geolocation ;
  routeToggle!: Toggle;
  locationToggle !: Toggle;
  selectedCine=signal<CineCart|undefined>(undefined);
  styles = signal<{[key:string]: Style}>({});

  cines= signal<CineCart[]>([]);



  constructor(){
    this.cineSer.loadCartelera();
  }

  ngOnInit(): void {
     this.initMap();
     this.generateStyles();

     this.cineSer.cartelera$.subscribe({
       next:(data) =>{
         console.log(data);
         this.cines.set(data);
         this.generateCines(this.cines());
       }
     });

     this.generateSelect();
     this.generateTooltip();
     this.controlBar();

  }


  initMap(){
    const zoomBar = new Bar({
      toggleOne: true,
      group:false,
      controls:[new Zoom()]
    });
    zoomBar.setPosition('top-left');
    this.vector = new Vector();
    this.layer = new VectorLayer({source: this.vector, });
    this.map = new Map({
      target: 'map',

      controls:[new Zoom()],
      view: new View({
        center:[-297572.2948370609, 5288707.104109812],
        zoom: 10
      }),
      layers: [new TileLayer({source: new OSM()}), this.layer]
    });

  }

  /**OK
   * Crea la barra de controles
   */
  controlBar(){

    var controlBar = new Bar({
      toggleOne: false,
      group:false,
      className:'editBar'
    });
    controlBar.setPosition('bottom');
    this.map.addControl(controlBar);

    //Creacion de Toggles
    this.locationToggle = new Toggle({
      html:'<i class="fa-solid fa-location-crosshairs"></i>',
      className:'location',
      title: 'Ubicacion Actual',
      onToggle: ((active) =>{
        if(active){
          this.mostrarLocalizacion();
          if(this.selectedCine())
            this.routeToggle.setVisible(true);
        }

        else{
          this.vector.removeFeature(this.location);
          this.geolocation = new Geolocation();
          this.routeToggle.setVisible(false);
          this.routeToggle.setActive(false);
          this.resetRuta();
        }
      }),
    });
    this.routeToggle = new Toggle({
      html:'<i class="fa-solid fa-route"></i>',
      className:'route',
      title:'Trazar la ruta',
      onToggle:((active) =>{
        if(active){
          if(!this.geolocation.getPosition() || ! this.selectedCine())
            this.routeToggle.setActive(false);
          else
            this.calcularRuta();
        }
        else
          this.resetRuta();
      })
    });
    this.routeToggle.setVisible(false);
    //Añadir los controles
    controlBar.addControl(this.locationToggle);
    controlBar.addControl(this.routeToggle);
  }

  /**
   * Calcula la ruta entre la localizacion actual y la muestra en el mapa
   * @private
   */
  private calcularRuta(){
     let cineF :any;
     const posicion = this.geolocation.getPosition()
     if( posicion){
       this.vector.getFeatures().forEach(f =>{
         if(f.get('cine_id')){
           if (f.get('cine_id') !== this.selectedCine()?.id)
             this.vector.removeFeature(f);
           else
             cineF = f;
         }
       });

       if(cineF instanceof  Feature) {
         const cine = this.cineSer.getCineByid(cineF.get('cine_id'));

         this.geoSer.ruta(
           posicion,
           [cine!.latitud, cine!.longitud]
         ).subscribe({
           next:(data) =>{
             const route = new Polyline({
               factor:1e5
             }).readGeometry(data,{
               dataProjection: 'EPSG:4326',
               featureProjection: 'EPSG:3857'
             });

             const routeFeature = new Feature({
               type: 'route',
               geometry: route,
             });
             const startMarker = new Feature({
               type: 'icon',
               geometry: new Point(this.geolocation.getPosition()!),
             });
             const endMarker = new Feature({
               type: 'icon',
               geometry: new Point([cine!.latitud, cine!.longitud]),
             });
             const position = startMarker.getGeometry()!.clone();
             const geoMarker = new Feature({
               type: 'geoMarker',
               geometry: position,
             });

             const styles: { [key: string]: Style } = {
               'route': new Style({
                 stroke: new Stroke({
                   width: 6,
                   color: [237, 212, 0, 0.8],
                 }),
               }),
               'icon': new Style({
                 image: new Icon({
                   anchor: [0.5, 1],
                   src: 'data/icon.png',
                 }),
               }),
               'geoMarker': new Style({
                 image: new CircleStyle({
                   radius: 7,
                   fill: new Fill({color: 'black'}),
                   stroke: new Stroke({
                     color: 'white',
                     width: 2,
                   }),
                 }),
               }),
             };

             this.routeLayer = new VectorLayer({
               source: new VectorSource({
                 features: [routeFeature, geoMarker, startMarker, endMarker],
               }),
               style:  (feature)=> styles[feature.get('type')],
             });
             this.map.addLayer(this.routeLayer);
           }
         });
       }
     }

  }

  /**
   * Muestra la localizacion en el mapa
   * @private
   */
  private mostrarLocalizacion(){
    this.geolocation = new Geolocation({
      trackingOptions: {enableHighAccuracy: true},
      tracking:true,
      projection: this.map.getView().getProjection()
    });

    console.log("CREADO");
    this.geolocation.on("change:position", (evt)=> {
      const position = this.geolocation.getPosition();
      if(position != undefined){
        this.geoSer.updateLocalizacion(position);
        //Elimina el icono de la localizacion anterior
        this.vector.removeFeature(this.location);
        this.location = new Feature({
          geometry: new Point(position),
        });
        this.location.setStyle(this.createStyle('black', 'location.png'));
        this.vector.addFeature(this.location);
      }
    });
  }

  /**
   * Genera los select
   */
  generateSelect(){
    this.map.on('singleclick',(e) =>{
      let feature = this.map
      .forEachFeatureAtPixel(e.pixel, (feature) =>{
        if(feature.get('cine_id')){
          //Cambia el tamaño de los iconos

          this.updateStyle(this.vector.getFeatures(), false);
          if(feature instanceof Feature)
            this.updateStyle([feature], true);
          this.selectedCine.set(this.cineSer.getCineByid(feature.get('cine_id')));
          //Guarda los datos del cines seleccionado
          this.datosSer.updateMostrar(DataType.cine);
          this.datosSer.updateData(
            this.cineSer.getCineByid(feature.get('cine_id'))!
          );
          if(this.locationToggle.getActive())
            this.routeToggle.setVisible(true);
        }
        return feature;
      });
      if(feature === undefined && this.routeLayer === undefined){
        this.updateStyle(this.vector.getFeatures(), false);
        this.selectedCine.set(undefined);
        this.datosSer.updateMostrar(DataType.nada);
        this.routeToggle.setVisible(false);

      }
    });
  }

  /**
   * Crea un estilo con el color y el icono
   * @param color
   */
  createStyle(color: string, icon: string, big:boolean = false): Style{
    return new Style({
      image: new Icon({
        color:color,
        crossOrigin: 'anonymous',
        height: big ? 50 : 25,
        width: big ? 50 : 25,
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'assets/'+icon,
      })
    });
  }

  /**
   * Actualiza el estilo de los iconos de los cines
   * @param features
   * @param big
   */
  updateStyle(features:Feature[], big: boolean){
    let key:any = undefined;
    features.forEach(feature =>{
      if(big != feature.get('big')){
        const style = feature.get('style');
        if(style === 'rojo')
          key = big ? 'rojo_select' : 'rojo';
        else if(style === 'negro')
          key = big ? 'negro_select' : 'negro';

        if(key != undefined){
          feature.setStyle(this.styles()[key]);
          feature.set('big', big);
        }
      }
    });
  }

  /**
   * Inserta los cines en el vector
   */
  generateCines(cines: CineCart[] ){
    if(this.vector.getFeatures().length > 0){
      this.vector.getFeatures().forEach(feature =>{
        if(feature.get('cine_id'))
          this.vector.removeFeature(feature);
      });
    }

    cines.forEach((cine) =>{
      const feature = new Feature({
        geometry: new Point(transform(
          [cine.latitud, cine.longitud],
          'EPSG:4326',
          'EPSG:3857'
        )) ,
        cine_id: cine.id,
        cine_nombre: cine.nombre,
        style: (cine.peliculas.length > 0) ? 'negro' : 'rojo',
        big: false,
      });
      //Añade el estilo
      feature.setStyle(
         this.styles()[(cine.peliculas.length > 0) ? 'negro' :'rojo']
      );

      this.vector.addFeature(feature);
    });
  }

  /**
   * Genera los distintos estilos
   */
  generateStyles(){
    let styles =
      {
        'negro' : this.createStyle('black', 'cinema-marker-icon.png', false),
        'negro_select' : this.createStyle('black', 'cinema-marker-icon.png', true),
        'rojo' : this.createStyle('red', 'cinema-marker-icon.png', false),
        'rojo_select' : this.createStyle('red', 'cinema-marker-icon.png', true)
      };

    this.styles.set(styles);
  }

  /**
   * Resetea el mapa
   */
  resetRuta(){

    this.generateCines(this.cines());
    if(this.routeLayer != undefined)
      this.map.removeLayer(this.routeLayer);
    this.routeLayer = undefined;
    this.selectedCine.set(undefined);

  }

  /**
   * Genera el Tooltip con el nombre del cine
   */
  generateTooltip() {
    const hover = new Hover();
    this.map.addInteraction(hover);

    const nameContainer = document.getElementById('cine');
    hover.on("enter", (e) => nameContainer!.style.visibility = 'visible');
    hover.on("leave", (e) => nameContainer!.style.visibility = 'hidden');

    this.map.on('pointermove', (e) => {
      let currentFeature = '';
      this.map.forEachFeatureAtPixel(e.pixel, (feature) => {
        let selected = feature.get('cine_nombre');

        if (selected) {
          nameContainer!.style.left = e.pixel[0] + 'px';
          nameContainer!.style.top = e.pixel[1] + 5 + 'px';
          if (selected !== currentFeature) {
            nameContainer!.innerText = selected;
            currentFeature = selected;
          }
        }
      });
    });
  }

}
