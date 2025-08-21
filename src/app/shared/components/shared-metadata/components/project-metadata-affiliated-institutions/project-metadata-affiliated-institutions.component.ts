import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { AffiliatedInstitutionsViewComponent } from '@shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { Institution } from '@shared/models';

@Component({
  selector: 'osf-project-metadata-affiliated-institutions',
  imports: [Button, Card, TranslatePipe, AffiliatedInstitutionsViewComponent],
  templateUrl: './project-metadata-affiliated-institutions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataAffiliatedInstitutionsComponent {
  openEditAffiliatedInstitutionsDialog = output<void>();

  affiliatedInstitutions = input<Institution[]>([]);
  readonly = input<boolean>(false);
}
