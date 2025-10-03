import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, effect, input, OnInit, signal } from '@angular/core';

import { ReviewsState } from '@osf/features/preprints/enums';
import { Preprint, PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintStepperSelectors, SetInstitutionsChanged } from '@osf/features/preprints/store/preprint-stepper';
import { AffiliatedInstitutionSelectComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { Institution } from '@osf/shared/models';
import {
  FetchResourceInstitutions,
  FetchUserInstitutions,
  InstitutionsSelectors,
  UpdateResourceInstitutions,
} from '@osf/shared/stores/institutions';

@Component({
  selector: 'osf-preprints-affiliated-institutions',
  imports: [AffiliatedInstitutionSelectComponent, Card, TranslatePipe],
  templateUrl: './preprints-affiliated-institutions.component.html',
  styleUrl: './preprints-affiliated-institutions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsAffiliatedInstitutionsComponent implements OnInit {
  provider = input.required<PreprintProviderDetails | undefined>();
  preprint = input.required<Preprint | null>();

  selectedInstitutions = signal<Institution[]>([]);

  userInstitutions = select(InstitutionsSelectors.getUserInstitutions);
  areUserInstitutionsLoading = select(InstitutionsSelectors.areUserInstitutionsLoading);
  resourceInstitutions = select(InstitutionsSelectors.getResourceInstitutions);
  areResourceInstitutionsLoading = select(InstitutionsSelectors.areResourceInstitutionsLoading);
  areResourceInstitutionsSubmitting = select(InstitutionsSelectors.areResourceInstitutionsSubmitting);
  institutionsChanged = select(PreprintStepperSelectors.getInstitutionsChanged);

  private readonly actions = createDispatchMap({
    fetchUserInstitutions: FetchUserInstitutions,
    fetchResourceInstitutions: FetchResourceInstitutions,
    updateResourceInstitutions: UpdateResourceInstitutions,
    setInstitutionsChanged: SetInstitutionsChanged,
  });

  constructor() {
    effect(() => {
      const resourceInstitutions = this.resourceInstitutions();
      if (resourceInstitutions.length > 0) {
        this.selectedInstitutions.set([...resourceInstitutions]);
      }
    });

    effect(() => {
      const userInstitutions = this.userInstitutions();
      const isCreateFlow = this.preprint()?.reviewsState === ReviewsState.Initial;

      if (userInstitutions.length > 0 && isCreateFlow && !this.institutionsChanged()) {
        this.actions.setInstitutionsChanged(true);
        this.onInstitutionsChange(userInstitutions);
      }
    });
  }

  ngOnInit() {
    this.actions.fetchUserInstitutions();
    this.actions.fetchResourceInstitutions(this.preprint()!.id, ResourceType.Preprint);
  }

  onInstitutionsChange(institutions: Institution[]): void {
    this.actions.updateResourceInstitutions(this.preprint()!.id, ResourceType.Preprint, institutions);
  }
}
