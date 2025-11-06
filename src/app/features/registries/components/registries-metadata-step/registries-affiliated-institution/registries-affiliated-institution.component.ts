import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AffiliatedInstitutionSelectComponent } from '@osf/shared/components/affiliated-institution-select/affiliated-institution-select.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { Institution } from '@osf/shared/models/institutions/institutions.models';
import {
  FetchResourceInstitutions,
  FetchUserInstitutions,
  InstitutionsSelectors,
  UpdateResourceInstitutions,
} from '@osf/shared/stores/institutions';

@Component({
  selector: 'osf-registries-affiliated-institution',
  imports: [Card, AffiliatedInstitutionSelectComponent, TranslatePipe],
  templateUrl: './registries-affiliated-institution.component.html',
  styleUrl: './registries-affiliated-institution.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesAffiliatedInstitutionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly draftId = this.route.snapshot.params['id'];

  selectedInstitutions = signal<Institution[]>([]);

  userInstitutions = select(InstitutionsSelectors.getUserInstitutions);
  areUserInstitutionsLoading = select(InstitutionsSelectors.areUserInstitutionsLoading);
  resourceInstitutions = select(InstitutionsSelectors.getResourceInstitutions);
  areResourceInstitutionsLoading = select(InstitutionsSelectors.areResourceInstitutionsLoading);
  areResourceInstitutionsSubmitting = select(InstitutionsSelectors.areResourceInstitutionsSubmitting);

  private actions = createDispatchMap({
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
    this.actions.fetchResourceInstitutions(this.draftId, ResourceType.DraftRegistration);
  }

  institutionsSelected(institutions: Institution[]) {
    this.actions.updateResourceInstitutions(this.draftId, ResourceType.DraftRegistration, institutions);
  }
}
