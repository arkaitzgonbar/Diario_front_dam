import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './helpers/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch:'full'},
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path:'register',
    component: RegisterComponent
  },
  {
    path: 'mi-app',
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [authGuard], // Protege esta ruta con el guard
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then((m) => m.ModalPageModule),
    canActivate: [authGuard], // Protege esta ruta con el guard
  },
  {
    path: 'nueva-clasificacion',
    loadChildren: () =>
      import('./nueva-clasificacion/nueva-clasificacion.module').then(
        (m) => m.NuevaClasificacionPageModule
      ),
    canActivate: [authGuard], // Protege esta ruta con el guard
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
