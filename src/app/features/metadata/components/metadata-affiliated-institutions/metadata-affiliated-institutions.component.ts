import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { Institution } from '@osf/shared/models/institutions/institutions.model';

import { BaseMetadataComponent } from '../base-metadata.component';

@Component({
  selector: 'osf-metadata-affiliated-institutions',
  imports: [Button, Card, Tooltip, TranslatePipe, AffiliatedInstitutionsViewComponent],
  templateUrl: './metadata-affiliated-institutions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataAffiliatedInstitutionsComponent extends BaseMetadataComponent {
  openEditAffiliatedInstitutionsDialog = output<void>();

  affiliatedInstitutions = input<Institution[]>([]);
  readonly = input<boolean>(false);
}
