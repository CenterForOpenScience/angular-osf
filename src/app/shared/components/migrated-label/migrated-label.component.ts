import { TranslatePipe } from '@ngx-translate/core';

import { Tag } from 'primeng/tag';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'osf-migrated-label',
  imports: [Tag, TranslatePipe],
  templateUrl: './migrated-label.component.html',
  styleUrl: './migrated-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MigratedLabelComponent {
  readonly isMigrated = input(false);
}
