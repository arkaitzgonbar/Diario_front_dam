import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {StorageService} from "../servicios/storage.service";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const logueado = inject(StorageService).esLogueado();

  if (!logueado) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
