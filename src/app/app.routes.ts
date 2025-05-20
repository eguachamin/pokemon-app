import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/pokemon.page').then(m => m.PokemonPage),
  },
];