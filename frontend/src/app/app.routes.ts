import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'players',
    loadComponent: () =>
      import('./pages/players/players.component').then(m => m.PlayersComponent)
  },
  {
    path: 'players/:id',
    loadComponent: () =>
      import('./pages/player-detail/player-detail.component').then(m => m.PlayerDetailComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
