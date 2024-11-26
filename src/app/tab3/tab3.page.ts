import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { latLng, tileLayer, Map, marker, icon, Layer, LatLngBounds } from 'leaflet';
import * as L from 'leaflet';
import { CargarPelisService } from '../Servicios/cargar-pelis.service';
import { Cartelera } from '../mis-interfaces/cartelera';
import { GeoService } from '../Servicios/geo.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, AfterViewInit, OnDestroy {
 
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
    this.loadMovies(); //método para cargar las peliculas y sus cines
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
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      return;
    }
    if (this.map) {
      this.map.remove();
    }
  
    this.map = new Map('map').setView([this.lat, this.lng], 8);
  
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  
    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);
  }

  ionViewWillLeave(): void {
    this.ngOnDestroy(); 
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined!; 
    }
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      mapContainer.innerHTML = ''; 
    }
    this.carga.setTituloPeliculaSeleccionada("");
  }

  loadMovies(): void {
    this.carga.getCartelera().subscribe(
      (movies: Cartelera[]) => {
        this.movies = movies; 
        console.log(this.movies); 
       
        this.movieTitles = [...this.movies.map(movie => movie.pelicula)];
        console.log("Lista de títulos de películas:", this.movieTitles);
      },
      (error) => {
        console.error('Error al cargar las películas', error);
      }
    );
  }

  ngAfterViewInit(): void {
    // Inicializa el mapa
    this.map = new Map('map').setView([this.lat, this.lng], 8);
    
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Llama a invalidateSize() después de una demora de 300 ms
    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);
  }

  buscarCines(): void {
    if (this.selectedMunicipio === 'Posición Actual') {
    
      this.osm.getCurrentPosition().subscribe(
        (coords) => {
          this.lat = coords.latitude;
          this.lng = coords.longitude;
          this.updateMap(); 
          this.osm.getNearbyCinemas(this.lat, this.lng, this.selectedDistancia).subscribe(cineResponse => {
            if (cineResponse && cineResponse.elements) {
              this.cines = cineResponse.elements;
              this.updateCineMarkers(); 
              console.log('Datos de cines obtenidos:', this.cines);
            }
          });
        },
        (error) => {
          console.error('Error al obtener la geolocalización:', error);
          alert('No se pudo obtener la ubicación.');
        }
      );
    } else if (this.selectedMunicipio && this.selectedDistancia) {
      
      this.osm.getCoordinates(this.selectedMunicipio).subscribe(response => {
        if (response && response.length > 0) {
          const location = response[0];
          this.lat = parseFloat(location.lat);
          this.lng = parseFloat(location.lon);
          this.updateMap(); 
          this.osm.getNearbyCinemas(this.lat, this.lng, this.selectedDistancia).subscribe(cineResponse => {
            if (cineResponse && cineResponse.elements) {
              this.cines = cineResponse.elements;
              this.updateCineMarkers(); 
              console.log('Datos de cines obtenidos:', this.cines);
            }
          });
        }
      });
    }
  }

  updateMap(): void {
    this.map.setView([this.lat, this.lng], 13); // Centra el mapa en la nueva ubicación
  }

  updateCineMarkers(): void {
    const selectedMovie = this.movies.find(movie => movie.pelicula === this.selectedMovieTitle);

    if (!selectedMovie) {
        alert('La película seleccionada no está en cartelera.');
        this.clearMarkers(); // Limpiar marcadores si la película no está disponible
        return;
    }

    let filteredCines = this.cines;

    if (this.selectedMovieTitle !== '') {
        filteredCines = this.cines.filter(cine => {
            return selectedMovie.cines.some(cinema => {
                return cinema.lat === cine.lat && cinema.lon === cine.lon;
            });
        });
    }

    if (filteredCines.length > 0) {
        let cineLat: number;
        let cineLon: number;

        const firstCine = filteredCines[0];

        if (firstCine.type === 'node') {
            cineLat = firstCine.lat;
            cineLon = firstCine.lon;
        } else if (firstCine.type === 'way' || firstCine.type === 'relation') {
            cineLat = firstCine.center.lat;
            cineLon = firstCine.center.lon;
        } else {
            return;
        }

        const bounds = new LatLngBounds([cineLat, cineLon], [cineLat, cineLon]);

        const cineMarker = marker([cineLat, cineLon], {
            icon: icon({
                iconSize: [25, 41],
                iconAnchor: [13, 41],
                iconUrl: 'assets/cinema-marker-icon.png',
                shadowUrl: 'assets/marker-shadow.png'
            })
        }).bindPopup(firstCine.tags.name || 'Cine');

        cineMarker.addTo(this.map);

        filteredCines.forEach(cine => {
            if (cine.type === 'node') {
                cineLat = cine.lat;
                cineLon = cine.lon;
            } else if (cine.type === 'way' || cine.type === 'relation') {
                cineLat = cine.center.lat;
                cineLon = cine.center.lon;
            } else {
                return;
            }

            const cineMarker = L.marker([cineLat, cineLon], {
                icon: L.icon({
                    iconSize: [25, 41],
                    iconAnchor: [13, 41],
                    iconUrl: 'assets/cinema-marker-icon.png',
                    shadowUrl: 'assets/marker-shadow.png'
                })
            }).bindPopup(cine.tags.name || 'Cine');

            cineMarker.addTo(this.map);

            bounds.extend([cineLat, cineLon]);
        });

        this.map.fitBounds(bounds);
    } else {
        alert('No hay cines disponibles para esta película en esta ubicación.');
    }
}

clearMarkers(): void {
    this.map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            this.map.removeLayer(layer);
        }
    });
}

}
