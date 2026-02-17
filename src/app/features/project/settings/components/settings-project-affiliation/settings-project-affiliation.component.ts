import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, OnInit, output } from '@angular/core';

import { Institution } from '@osf/shared/models/institutions/institutions.model';
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
  canEdit = input<boolean>(false);
  canRemove = input<boolean>(false);
  removed = output<Institution>();

  userInstitutions = select(InstitutionsSelectors.getUserInstitutions);

  readonly userInstitutionIds = computed(() => new Set(this.userInstitutions().map((inst) => inst.id)));

  private readonly actions = createDispatchMap({ fetchUserInstitutions: FetchUserInstitutions });

  ngOnInit() {
    if (this.canEdit()) {
      this.actions.fetchUserInstitutions();
    }
  }

  canRemoveAffiliation(institution: Institution): boolean {
    return this.canRemove() || (this.canEdit() && this.userInstitutionIds().has(institution.id));
  }

  removeAffiliation(affiliation: Institution) {
    this.removed.emit(affiliation);
  }
}
