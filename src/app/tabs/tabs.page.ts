import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {StorageService} from "../servicios/storage.service";
import {AuthService} from "../servicios/auth.service";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private storage: StorageService, private autenticacion: AuthService, private router: Router) {}

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
