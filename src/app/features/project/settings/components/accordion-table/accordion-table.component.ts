import { Button } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type RightControl =
  | {
      type: 'dropdown';
      label?: string;
      value: string;
      options: { label: string; value: string }[];
      onChange?: (value: string) => void;
    }
  | {
      type: 'text';
      label?: string;
      value: string;
    };

@Component({
  selector: 'osf-accordion-table',
  imports: [NgClass, SelectModule, FormsModule, Button],
  templateUrl: './accordion-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionTableComponent {
  title = input.required<string>();

  rightControls = input.required<RightControl[]>();

  expanded = signal(false);

  toggle() {
    this.expanded.set(!this.expanded());
  }
}
