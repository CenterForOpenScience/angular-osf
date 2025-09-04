import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components';
import { Institution } from '@osf/shared/models';

@Component({
  selector: 'osf-metadata-affiliated-institutions',
  imports: [Button, Card, TranslatePipe, AffiliatedInstitutionsViewComponent],
  templateUrl: './metadata-affiliated-institutions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataAffiliatedInstitutionsComponent {
  openEditAffiliatedInstitutionsDialog = output<void>();

  affiliatedInstitutions = input<Institution[]>([]);
  readonly = input<boolean>(false);
}
