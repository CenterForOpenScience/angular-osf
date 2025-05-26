import { Button } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RightControl } from '../../models';

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
