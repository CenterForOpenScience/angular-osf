import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'osf-preprints-help-dialog',
  imports: [TranslatePipe],
  templateUrl: './preprints-help-dialog.component.html',
  styleUrl: './preprints-help-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsHelpDialogComponent {}
