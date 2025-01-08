import { Injectable } from '@angular/core';

const CLAVE_USUARIO =  'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  limpiar(): void{
    localStorage.clear();
    window.sessionStorage.clear();
  }

  public setUsuario(usuario: any): void {
    localStorage.removeItem(CLAVE_USUARIO);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  }

  public getUsuario(): any {
    const usuario = localStorage.getItem(CLAVE_USUARIO);
    if(usuario) {
      return JSON.parse(usuario);
    }

    return {};
  }

  public esLogueado(): boolean {
    const usuario = localStorage.getItem(CLAVE_USUARIO);
    if (usuario) {
      return true;
    }

    return false;
  }
}
