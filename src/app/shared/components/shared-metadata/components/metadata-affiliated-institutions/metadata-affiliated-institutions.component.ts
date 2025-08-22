import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ProjectAffiliatedInstitutions } from '@osf/features/project/overview/models';

@Component({
  selector: 'osf-metadata-affiliated-institutions',
  imports: [Button, Card, TranslatePipe],
  templateUrl: './metadata-affiliated-institutions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataAffiliatedInstitutionsComponent {
  openEditAffiliatedInstitutionsDialog = output<void>();

  affiliatedInstitutions = input<ProjectAffiliatedInstitutions[]>([]);
  readonly = input<boolean>(false);
}
