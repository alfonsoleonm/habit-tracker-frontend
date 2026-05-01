import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar';
import { AuthService } from './services/auth';
import { HabitsService } from './services/habits';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`main { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }`]
})
export class App implements OnInit {
  private auth = inject(AuthService);
  private habits = inject(HabitsService);

  async ngOnInit() {
    const token = await this.auth.init();
    if (token) this.habits.setToken(token);
  }
}