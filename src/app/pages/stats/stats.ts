import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitsService } from '../../services/habits';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class StatsComponent {
  private svc = inject(HabitsService);
  months = computed(() => this.svc.months());

  streak(colId: string, monthId: string): number {
    const month = this.svc.getMonth(monthId);
    if (!month) return 0;
    const today = new Date().getDate();
    let streak = 0;
    for (let d = today; d >= 1; d--) {
      const entry = month.entries.find(e => e.day === d);
      if (entry?.checks[colId]) streak++;
      else break;
    }
    return streak;
  }

  pct(colId: string, monthId: string): number {
    const month = this.svc.getMonth(monthId);
    if (!month) return 0;
    const today = new Date().getDate();
    const past = month.entries.filter(e => e.day <= today);
    if (!past.length) return 0;
    return Math.round(past.filter(e => e.checks[colId]).length / past.length * 100);
  }
}
