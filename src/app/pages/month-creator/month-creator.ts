import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HabitsService, CORE_HABITS, HabitColumn } from '../../services/habits';

@Component({
  selector: 'app-month-creator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './month-creator.html',
  styleUrl: './month-creator.scss'
})
export class MonthCreatorComponent {
  private svc = inject(HabitsService);
  private router = inject(Router);

  coreHabits = CORE_HABITS;
  customColumns = signal<HabitColumn[]>([]);
  newLabel = '';
  selectedMonthId = signal<string>(this.nextMonthId());

  nextMonthId(): string {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  monthLabel(id: string): string {
    const [y, m] = id.split('-').map(Number);
    return new Date(y, m - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  addCustom() {
    const label = this.newLabel.trim();
    if (!label) return;
    this.customColumns.update(cols => [
      ...cols,
      { id: label.toLowerCase().replace(/\s+/g, '-'), label, core: false }
    ]);
    this.newLabel = '';
  }

  removeCustom(id: string) {
    this.customColumns.update(cols => cols.filter(c => c.id !== id));
  }

  create() {
    const id = this.selectedMonthId();
    this.svc.createMonth(id, this.monthLabel(id), this.customColumns());
    this.router.navigate(['/calendar']);
  }
}
