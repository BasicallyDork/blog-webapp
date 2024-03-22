import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/static-pages/static-pages.module').then(m => m.StaticPagesModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    scrollPositionRestoration: "enabled",
    anchorScrolling: 'enabled',
    scrollOffset: [0, 130] 
})],
  exports: [RouterModule],
  // providers:[AuthGuard]
})
export class AppRoutingModule { }
