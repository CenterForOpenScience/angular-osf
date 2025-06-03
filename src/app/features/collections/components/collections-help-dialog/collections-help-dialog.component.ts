import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'osf-collections-help-dialog',
  imports: [TranslatePipe],
  templateUrl: './collections-help-dialog.component.html',
  styleUrl: './collections-help-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsHelpDialogComponent {}
