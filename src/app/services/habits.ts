import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

export interface HabitColumn {
  id: string;
  label: string;
  core: boolean;
}

export interface DayEntry {
  day: number;
  checks: Record<string, boolean>;
}

export interface Month {
  id: string;
  label: string;
  columns: HabitColumn[];
  entries: DayEntry[];
}

export const CORE_HABITS: HabitColumn[] = [
  { id: 'meditation', label: 'Meditation / NSDR', core: true },
  { id: 'journaling', label: 'Journaling', core: true },
  { id: 'reading', label: 'Reading', core: true },
  { id: 'study', label: 'Study', core: true },
];

@Injectable({ providedIn: 'root' })
export class HabitsService {
  private _months = signal<Month[]>([]);
  months = this._months.asReadonly();
  activeMonth = signal<string>(this.currentMonthId());
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    this.loadMonths();
  }

  private headers() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  currentMonthId(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  getMonth(id: string): Month | undefined {
    return this._months().find(m => m.id === id);
  }

  async loadMonths() {
    const res = await fetch(`${environment.apiUrl}/months`, {
      headers: this.headers()
    });
    const data = await res.json();
    this._months.set(data);
    if (data.length > 0) this.activeMonth.set(data[data.length - 1].id);
  }

  async toggle(monthId: string, day: number, colId: string) {
    const month = this.getMonth(monthId);
    if (!month) return;
    const entry = month.entries.find(e => e.day === day);
    if (!entry) return;
    const newValue = !entry.checks[colId];

    // optimistic update
    this._months.update(months =>
      months.map(m => {
        if (m.id !== monthId) return m;
        const entries = m.entries.map(e => {
          if (e.day !== day) return e;
          return { ...e, checks: { ...e.checks, [colId]: newValue } };
        });
        return { ...m, entries };
      })
    );

    await fetch(`${environment.apiUrl}/months/${monthId}/days/${day}`, {
      method: 'PATCH',
      headers: this.headers(),
      body: JSON.stringify({ colId, value: newValue })
    });
  }

  async createMonth(id: string, label: string, customColumns: HabitColumn[]) {
    const res = await fetch(`${environment.apiUrl}/months`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ id, label, customColumns })
    });
    const month = await res.json();
    this._months.update(m => [...m, month]);
    this.activeMonth.set(month.id);
  }
}