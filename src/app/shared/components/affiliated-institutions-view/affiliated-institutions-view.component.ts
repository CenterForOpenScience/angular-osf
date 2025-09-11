import { TranslatePipe } from '@ngx-translate/core';

import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Institution } from '@shared/models';

@Component({
  selector: 'osf-affiliated-institutions-view',
  imports: [TranslatePipe, RouterLink, Tooltip],
  templateUrl: './affiliated-institutions-view.component.html',
  styleUrl: './affiliated-institutions-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AffiliatedInstitutionsViewComponent {
  showTitle = input<boolean>(true);
  institutions = input.required<Institution[]>();
}
