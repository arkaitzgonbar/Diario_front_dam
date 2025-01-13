import {Component, inject, OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
import {ListaService} from "../servicios/lista.service";

@Component({
  selector: 'app-nueva-clasificacion',
  templateUrl: './nueva-clasificacion.page.html',
  styleUrls: ['./nueva-clasificacion.page.scss'],
})
export class NuevaClasificacionPage {
  private listasSer = inject(ListaService);

  nuevaLista: string = '';

  constructor(private modalController: ModalController) {}

  cerrar() {
    this.modalController.dismiss();
  }

  agregarClasificacion() {
    if (this.nuevaLista.trim()) {
      this.listasSer.addLista(this.nuevaLista);
      //this.clasificacionService.agregarClasificacion(this.nuevaClasificacion);
      this.modalController.dismiss(this.nuevaLista);
    }
  }

}
