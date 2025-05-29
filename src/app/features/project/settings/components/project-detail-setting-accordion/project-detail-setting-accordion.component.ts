import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RightControl } from '../../models';

@Component({
  selector: 'osf-project-detail-setting-accordion',
  imports: [NgClass, SelectModule, FormsModule, Button, TranslatePipe],
  templateUrl: './project-detail-setting-accordion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProjectDetailSettingAccordionComponent {
  emitValueChange = output<{ index: number; value: boolean | string }>();
  title = input<string>();
  rightControls = input.required<RightControl[] | undefined>();
  expanded = signal(false);

  toggle() {
    this.expanded.set(!this.expanded());
  }
}
