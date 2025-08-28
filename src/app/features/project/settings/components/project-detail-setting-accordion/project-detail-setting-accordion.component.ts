import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SelectComponent } from '@osf/shared/components';

import { RightControl } from '../../models';

@Component({
  selector: 'osf-project-detail-setting-accordion',
  imports: [FormsModule, Button, SelectComponent, TranslatePipe],
  templateUrl: './project-detail-setting-accordion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailSettingAccordionComponent {
  emitValueChange = output<{ index: number; value: boolean | string }>();
  title = input<string>();
  rightControls = input.required<RightControl[] | undefined>();
  disabledRightControls = input(false);

  expanded = signal(false);

  toggle() {
    this.expanded.set(!this.expanded());
  }
}
