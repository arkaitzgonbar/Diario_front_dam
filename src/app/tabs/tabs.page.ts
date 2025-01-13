import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {StorageService} from "../servicios/storage.service";
import {AuthService} from "../servicios/auth.service";
import {CinesService} from "../servicios/cines.service";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{
  private cinesSer = inject(CinesService);

  constructor(private storage: StorageService, private autenticacion: AuthService, private router: Router) {}

  ngOnInit() {
    this.cinesSer.loadCartelera();
    console.log("Cargado");
  }

  logout(): void {
    this.autenticacion.logout().subscribe({
      next: res => {
        this.storage.limpiar();
        this.router.navigate(["/login"]);
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
