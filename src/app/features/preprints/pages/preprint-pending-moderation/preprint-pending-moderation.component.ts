import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'osf-preprint-pending-moderation',
  templateUrl: './preprint-pending-moderation.component.html',
  styleUrl: './preprint-pending-moderation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
})
export class PreprintPendingModerationComponent {}
