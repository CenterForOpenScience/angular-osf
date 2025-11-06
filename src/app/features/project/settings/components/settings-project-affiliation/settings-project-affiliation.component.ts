import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, OnInit, output } from '@angular/core';

import { Institution } from '@osf/shared/models/institutions/institutions.models';
import { FetchUserInstitutions, InstitutionsSelectors } from '@shared/stores/institutions';

@Component({
  selector: 'osf-settings-project-affiliation',
  imports: [Card, Button, NgOptimizedImage, TranslatePipe],
  templateUrl: './settings-project-affiliation.component.html',
  styleUrl: './settings-project-affiliation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsProjectAffiliationComponent implements OnInit {
  affiliations = input<Institution[]>([]);
  userInstitutions = select(InstitutionsSelectors.getUserInstitutions);
  removed = output<Institution>();
  canEdit = input<boolean>(false);

  removeAffiliationPermission = computed(() => {
    const affiliatedInstitutions = this.affiliations();
    const userInstitutions = this.userInstitutions();

    const result = new Map<string, boolean>();

    for (const institution of affiliatedInstitutions) {
      const isUserAffiliatedWithCurrentInstitution = userInstitutions.some(
        (userInstitution) => userInstitution.id === institution.id
      );
      result.set(institution.id, isUserAffiliatedWithCurrentInstitution);
    }

    return result;
  });

  private readonly actions = createDispatchMap({
    fetchUserInstitutions: FetchUserInstitutions,
  });

  ngOnInit() {
    this.actions.fetchUserInstitutions();
  }

  removeAffiliation(affiliation: Institution) {
    this.removed.emit(affiliation);
  }
}
