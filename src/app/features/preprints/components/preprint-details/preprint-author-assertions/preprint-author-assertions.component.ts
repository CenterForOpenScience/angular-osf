import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { PreprintModel } from '@osf/features/preprints/models';

@Component({
  selector: 'osf-preprint-author-assertions',
  imports: [TranslatePipe],
  templateUrl: './preprint-author-assertions.component.html',
  styleUrl: './preprint-author-assertions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintAuthorAssertionsComponent {
  readonly preprint = input.required<PreprintModel>();

  readonly ApplicabilityStatus = ApplicabilityStatus;
  readonly PreregLinkInfo = PreregLinkInfo;
}
