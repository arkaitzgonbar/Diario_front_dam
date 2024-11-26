import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/listado-peliculas', 
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then((m) => m.ModalPageModule),
  },
  {
    path: 'nueva-clasificacion',
    loadChildren: () =>
      import('./nueva-clasificacion/nueva-clasificacion.module').then(
        (m) => m.NuevaClasificacionPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
