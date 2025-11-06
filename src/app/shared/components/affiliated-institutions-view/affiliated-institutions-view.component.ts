import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Institution } from '@osf/shared/models/institutions/institutions.models';

@Component({
  selector: 'osf-affiliated-institutions-view',
  imports: [TranslatePipe, RouterLink, Tooltip, Skeleton],
  templateUrl: './affiliated-institutions-view.component.html',
  styleUrl: './affiliated-institutions-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AffiliatedInstitutionsViewComponent {
  institutions = input.required<Institution[]>();
  isLoading = input<boolean>(false);
}
