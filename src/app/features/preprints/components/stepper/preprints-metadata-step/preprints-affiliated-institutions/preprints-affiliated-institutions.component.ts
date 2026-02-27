import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, computed, effect, input, OnInit, signal } from '@angular/core';

import { ReviewsState } from '@osf/features/preprints/enums';
import { PreprintModel, PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintStepperSelectors, SetInstitutionsChanged } from '@osf/features/preprints/store/preprint-stepper';
import { AffiliatedInstitutionSelectComponent } from '@osf/shared/components/affiliated-institution-select/affiliated-institution-select.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { Institution } from '@osf/shared/models/institutions/institutions.model';
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
  readonly provider = input.required<PreprintProviderDetails>();
  readonly preprint = input.required<PreprintModel>();

  readonly selectedInstitutions = signal<Institution[]>([]);

  readonly userInstitutions = select(InstitutionsSelectors.getUserInstitutions);
  readonly areUserInstitutionsLoading = select(InstitutionsSelectors.areUserInstitutionsLoading);
  readonly resourceInstitutions = select(InstitutionsSelectors.getResourceInstitutions);
  readonly areResourceInstitutionsLoading = select(InstitutionsSelectors.areResourceInstitutionsLoading);
  readonly areResourceInstitutionsSubmitting = select(InstitutionsSelectors.areResourceInstitutionsSubmitting);
  readonly institutionsChanged = select(PreprintStepperSelectors.getInstitutionsChanged);

  private readonly actions = createDispatchMap({
    fetchUserInstitutions: FetchUserInstitutions,
    fetchResourceInstitutions: FetchResourceInstitutions,
    updateResourceInstitutions: UpdateResourceInstitutions,
    setInstitutionsChanged: SetInstitutionsChanged,
  });

  isLoading = computed(
    () =>
      this.areUserInstitutionsLoading() ||
      this.areResourceInstitutionsLoading() ||
      this.areResourceInstitutionsSubmitting()
  );

  constructor() {
    effect(() => {
      const resourceInstitutions = this.resourceInstitutions();
      if (resourceInstitutions.length > 0) {
        this.selectedInstitutions.set([...resourceInstitutions]);
      }
    });

    effect(() => {
      const userInstitutions = this.userInstitutions();
      const isCreateFlow = this.preprint().reviewsState === ReviewsState.Initial;

      if (userInstitutions.length > 0 && isCreateFlow && !this.institutionsChanged()) {
        this.actions.setInstitutionsChanged(true);
        this.onInstitutionsChange(userInstitutions);
      }
    });
  }

  ngOnInit() {
    this.actions.fetchUserInstitutions();
    this.actions.fetchResourceInstitutions(this.preprint().id, ResourceType.Preprint);
  }

  onInstitutionsChange(institutions: Institution[]): void {
    this.actions.updateResourceInstitutions(this.preprint()!.id, ResourceType.Preprint, institutions);
  }
}
