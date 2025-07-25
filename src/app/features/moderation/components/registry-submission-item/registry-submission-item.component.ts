import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconComponent } from '@osf/shared/components';
import { DateAgoPipe } from '@osf/shared/pipes';

import { ReviewStatusIcon } from '../../constants';
import { RegistryModeration } from '../../models';

@Component({
  selector: 'osf-registry-submission-item',
  imports: [IconComponent, DateAgoPipe, Button, TranslatePipe, RouterLink],
  templateUrl: './registry-submission-item.component.html',
  styleUrl: './registry-submission-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrySubmissionItemComponent {
  submission = input.required<RegistryModeration>();
  selected = output<void>();

  readonly reviewStatusIcon = ReviewStatusIcon;

  limitValue = 1;
  showAll = false;

  toggleHistory() {
    this.showAll = !this.showAll;
  }
}
