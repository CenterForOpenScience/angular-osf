import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AffiliatedInstitutionSelectComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { Institution } from '@osf/shared/models';
import {
  FetchResourceInstitutions,
  FetchUserInstitutions,
  InstitutionsSelectors,
  UpdateResourceInstitutions,
} from '@osf/shared/stores';

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
  readonly userInstitutions = select(InstitutionsSelectors.getUserInstitutions);
  readonly areResourceInstitutionsLoading = select(InstitutionsSelectors.areResourceInstitutionsLoading);

  private actions = createDispatchMap({
    fetchUserInstitutions: FetchUserInstitutions,
    fetchResourceInstitutions: FetchResourceInstitutions,
    updateResourceInstitutions: UpdateResourceInstitutions,
  });

  ngOnInit() {
    this.actions.fetchUserInstitutions();
    this.actions.fetchResourceInstitutions(this.draftId, ResourceType.DraftRegistration);
  }

  institutionsSelected(institutions: Institution[]) {
    this.actions.updateResourceInstitutions(this.draftId, ResourceType.DraftRegistration, institutions);
  }
}
