import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar/calendar').then(m => m.CalendarComponent)
  },
  {
    path: 'new-month',
    loadComponent: () => import('./pages/month-creator/month-creator').then(m => m.MonthCreatorComponent)
  },
  {
    path: 'stats',
    loadComponent: () => import('./pages/stats/stats').then(m => m.StatsComponent)
  },
  { path: '**', redirectTo: 'calendar' }
];
