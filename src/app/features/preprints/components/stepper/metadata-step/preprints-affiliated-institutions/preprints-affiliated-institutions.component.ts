import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, effect, input, OnInit, signal } from '@angular/core';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { AffiliatedInstitutionSelectComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { Institution } from '@shared/models';
import {
  FetchResourceInstitutions,
  FetchUserInstitutions,
  InstitutionsSelectors,
  UpdateResourceInstitutions,
} from '@shared/stores/institutions';

@Component({
  selector: 'osf-preprints-affiliated-institutions',
  imports: [AffiliatedInstitutionSelectComponent, Card, TranslatePipe],
  templateUrl: './preprints-affiliated-institutions.component.html',
  styleUrl: './preprints-affiliated-institutions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsAffiliatedInstitutionsComponent implements OnInit {
  provider = input.required<PreprintProviderDetails | undefined>();
  preprintId = input<string>();

  selectedInstitutions = signal<Institution[]>([]);

  userInstitutions = select(InstitutionsSelectors.getUserInstitutions);
  areUserInstitutionsLoading = select(InstitutionsSelectors.areUserInstitutionsLoading);
  resourceInstitutions = select(InstitutionsSelectors.getResourceInstitutions);
  areResourceInstitutionsLoading = select(InstitutionsSelectors.areResourceInstitutionsLoading);
  areResourceInstitutionsSubmitting = select(InstitutionsSelectors.areResourceInstitutionsSubmitting);

  private readonly actions = createDispatchMap({
    fetchUserInstitutions: FetchUserInstitutions,
    fetchResourceInstitutions: FetchResourceInstitutions,
    updateResourceInstitutions: UpdateResourceInstitutions,
  });

  constructor() {
    effect(() => {
      const resourceInstitutions = this.resourceInstitutions();
      if (resourceInstitutions.length > 0) {
        this.selectedInstitutions.set([...resourceInstitutions]);
      }
    });
  }

  ngOnInit() {
    this.actions.fetchUserInstitutions();
    this.actions.fetchResourceInstitutions(this.preprintId()!, ResourceType.Preprint);
  }

  onInstitutionsChange(institutions: Institution[]): void {
    this.selectedInstitutions.set(institutions);
    this.actions.updateResourceInstitutions(this.preprintId()!, ResourceType.Preprint, institutions);
  }
}
