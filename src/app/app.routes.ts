import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'calendar',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/calendar/calendar').then(m => m.CalendarComponent)
  },
  {
    path: 'new-month',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/month-creator/month-creator').then(m => m.MonthCreatorComponent)
  },
  {
    path: 'stats',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/stats/stats').then(m => m.StatsComponent)
  },
  { path: '**', redirectTo: 'login' }
];
