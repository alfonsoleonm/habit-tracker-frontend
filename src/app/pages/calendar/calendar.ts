import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HabitsService, DayEntry } from '../../services/habits';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class CalendarComponent {
  private svc = inject(HabitsService);

  today = new Date().getDate();
  currentMonthId = this.svc.currentMonthId();

  month = computed(() => this.svc.getMonth(this.svc.activeMonth()));
  months = computed(() => this.svc.months());

  setMonth(id: string) { this.svc.activeMonth.set(id); }

  toggle(day: number, colId: string) {
    const m = this.month();
    if (!m || this.isFuture(day)) return;
    this.svc.toggle(m.id, day, colId);
  }

  isFuture(day: number): boolean {
    return this.month()?.id === this.currentMonthId && day > this.today;
  }

  isToday(day: number): boolean {
    return this.month()?.id === this.currentMonthId && day === this.today;
  }

  completionPct(col: string, entries: DayEntry[]): number {
    const past = entries.filter(e => !this.isFuture(e.day));
    if (!past.length) return 0;
    return Math.round(past.filter(e => e.checks[col]).length / past.length * 100);
  }

  rowComplete(entry: DayEntry, columns: any[]): boolean {
    return columns.every(c => entry.checks[c.id]);
  }
}
