import { Injectable, signal } from '@angular/core';

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
  { id: 'journaling', label: 'Journaling',         core: true },
  { id: 'reading',    label: 'Reading',             core: true },
  { id: 'study',      label: 'Study',               core: true },
];

@Injectable({ providedIn: 'root' })
export class HabitsService {
  private _months = signal<Month[]>(this.mockMonths());
  months = this._months.asReadonly();
  activeMonth = signal<string>(this.currentMonthId());

  currentMonthId(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  getMonth(id: string): Month | undefined {
    return this._months().find(m => m.id === id);
  }

  toggle(monthId: string, day: number, colId: string) {
    this._months.update(months =>
      months.map(m => {
        if (m.id !== monthId) return m;
        const entries = m.entries.map(e => {
          if (e.day !== day) return e;
          return { ...e, checks: { ...e.checks, [colId]: !e.checks[colId] } };
        });
        return { ...m, entries };
      })
    );
    // TODO: PATCH /api/months/{monthId}/days/{day}
  }

  createMonth(id: string, label: string, customColumns: HabitColumn[]) {
    const [y, mo] = id.split('-').map(Number);
    const daysInMonth = new Date(y, mo, 0).getDate();
    const columns = [...CORE_HABITS, ...customColumns];
    const entries: DayEntry[] = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      checks: Object.fromEntries(columns.map(c => [c.id, false]))
    }));
    this._months.update(m => [...m, { id, label, columns, entries }]);
    // TODO: POST /api/months
  }

  private mockMonths(): Month[] {
    const id = this.currentMonthId();
    const d = new Date();
    const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const columns = [...CORE_HABITS];
    const entries: DayEntry[] = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      checks: Object.fromEntries(
        columns.map(c => [c.id, Math.random() > 0.4 && i + 1 < d.getDate()])
      )
    }));
    return [{ id, label, columns, entries }];
  }
}
