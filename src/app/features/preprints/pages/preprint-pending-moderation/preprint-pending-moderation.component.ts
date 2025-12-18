import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'osf-preprint-pending-moderation',
  imports: [TranslatePipe],
  templateUrl: './preprint-pending-moderation.component.html',
  styleUrl: './preprint-pending-moderation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintPendingModerationComponent {}
