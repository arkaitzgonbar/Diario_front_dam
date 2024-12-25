import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClasificacionService {
  // Lista de clasificaciones 
  clasificaciones: { [key: string]: any[] } = {
    'Favoritas': [],
    'Interesado': [],
    'En curso': [],
    'Descartado': []
  };

  // Estructura para almacenar valoraciones de películas (usando ID como clave)
  private valoraciones: { [key: string]: { total: number; suma: number } } = {};
 
   /**
   * Método para clasificar una película dentro de una lista específica.
   * Si ya existe en otra lista, la elimina primero.
   * @param pelicula La película a clasificar.
   * @param tipo El tipo de lista al que pertenece.
   */
    clasificar(pelicula: any, tipo: string) {
           
      this.eliminarDeListas(pelicula); // Elimina la película de cualquier lista en la que ya se encuentre
      
      // Añade la película a la lista seleccionada si ésta existe
      if (this.clasificaciones[tipo]) {
        this.clasificaciones[tipo].push(pelicula); 
        
      } else {
        console.warn(`Clasificación ${tipo} no existe`);
      }
    }

     /**
   * Método que sirve para Eliminar una película de todas las listas donde podría estar.
   * Esto garantiza que cada película esté en una sola lista.
   * @param pelicula La película a eliminar.
   */
  private eliminarDeListas(pelicula: any) {
    for (const key in this.clasificaciones) {
      this.clasificaciones[key] = this.clasificaciones[key].filter(p => p.titulo !== pelicula.titulo);
    }
  }

  /**
   * Devuelve todas las películas clasificadas en una lista específica.
   * @param tipo El tipo de clasificación a consultar.
   * @returns Las películas en esa clasificación.
   */
  obtenerClasificadas(tipo: string) {
    return this.clasificaciones[tipo] || [];
  }

  /**
   * Método para crear una nueva categoría de clasificacioón si no existe.
   * @param nuevaClasificacion El nombre de la nueva clasificación.
   */
  agregarClasificacion(nuevaClasificacion: string) {
    if (!this.clasificaciones[nuevaClasificacion]) {
      this.clasificaciones[nuevaClasificacion] = [];
    }
  }
/**
   * Método para eliminar una categoría completa de clasificaciones.
   * @param nombreClasificacion El nombre de la clasificación a eliminar.
   */
  eliminarClasificacion(nombreClasificacion: string) {
    delete this.clasificaciones[nombreClasificacion];
  }

  /**
   * Método que devuelve un array con todos los nombres de las clasificaciones disponibles.
   * @returns Lista de nombres de clasificaciones.
   */
  obtenerClasificaciones() {
    return Object.keys(this.clasificaciones);
  }

 /**
   * Método para eliminar una película específica de una categoría dada.
   * @param clasificacion La categoría de la que se quiere eliminar la película.
   * @param index Índice de la película en la lista de esa categoría.
   */
    eliminarPeliculaDeClasificacion(clasificacion: string, index: number) {
      // NOs aseguramos de que solo se elimine la película correspondiente a la clasificación y el índice específico
      const peliculasClasificadas = this.clasificaciones[clasificacion]; // Obtener las películas de la clasificación
      if (peliculasClasificadas && peliculasClasificadas.length > index) {
        peliculasClasificadas.splice(index, 1); // Elimina solo la película seleccionada
      }
    }

    /**
   * Método que obtiene la valoración promedio y el número de votos para una película específica.
   * @param idPelicula El identificador único de la película.
   * @returns Objeto con la media de la valoración y el total de votos.
   */
    obtenerValoracion(idPelicula: string) {
      const valoracion = this.valoraciones[idPelicula];
      if (valoracion) {
        return {
          media: valoracion.suma / valoracion.total,
          total: valoracion.total
        };
      }
      return { media: 0, total: 0 };
    }
  /**
   * método para guardar una nueva valoración para una película.
   * Actualiza el total de votos y la suma acumulada de las puntuaciones.
   * @param idPelicula El identificador único de la película.
   * @param valor El valor de la valoración (por ejemplo, de 1 a 5 estrellas).
   */
    guardarValoracion(idPelicula: string, valor: number) {
      if (!this.valoraciones[idPelicula]) {
        this.valoraciones[idPelicula] = { total: 0, suma: 0 };
      }
      this.valoraciones[idPelicula].total += 1;
      this.valoraciones[idPelicula].suma += valor;
    }
  
}

