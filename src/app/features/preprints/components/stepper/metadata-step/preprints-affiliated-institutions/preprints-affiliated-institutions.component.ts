import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { AffiliatedInstitutionSelectComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { Institution } from '@shared/models';
import { FetchResourceInstitutions, UpdateResourceInstitutions } from '@shared/stores/institutions';

@Component({
  selector: 'osf-preprints-affiliated-institutions',
  imports: [AffiliatedInstitutionSelectComponent, Card, TranslatePipe],
  templateUrl: './preprints-affiliated-institutions.component.html',
  styleUrl: './preprints-affiliated-institutions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsAffiliatedInstitutionsComponent implements OnInit {
  preprintId = input<string>();
  provider = input.required<PreprintProviderDetails | undefined>();

  private actions = createDispatchMap({
    fetchResourceInstitutions: FetchResourceInstitutions,
    updateResourceInstitutions: UpdateResourceInstitutions,
  });

  ngOnInit() {
    this.actions.fetchResourceInstitutions(this.preprintId()!, ResourceType.Preprint);
  }

  institutionsSelected(institutions: Institution[]) {
    this.actions.updateResourceInstitutions(this.preprintId()!, ResourceType.Preprint, institutions);
  }
}
