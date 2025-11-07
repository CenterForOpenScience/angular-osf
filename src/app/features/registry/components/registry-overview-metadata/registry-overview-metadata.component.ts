import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ResourceCitationsComponent } from '@osf/shared/components/resource-citations/resource-citations.component';
import { ResourceDoiComponent } from '@osf/shared/components/resource-doi/resource-doi.component';
import { ResourceLicenseComponent } from '@osf/shared/components/resource-license/resource-license.component';
import { SubjectsListComponent } from '@osf/shared/components/subjects-list/subjects-list.component';
import { TagsListComponent } from '@osf/shared/components/tags-list/tags-list.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ContributorsSelectors, LoadMoreBibliographicContributors } from '@osf/shared/stores/contributors';
import { FetchSelectedSubjects, SubjectsSelectors } from '@osf/shared/stores/subjects';

import {
  GetRegistryIdentifiers,
  GetRegistryInstitutions,
  GetRegistryLicense,
  RegistrySelectors,
  SetRegistryCustomCitation,
} from '../../store/registry';

@Component({
  selector: 'osf-registry-overview-metadata',
  imports: [
    Button,
    TranslatePipe,
    TruncatedTextComponent,
    RouterLink,
    DatePipe,
    ResourceCitationsComponent,
    ResourceDoiComponent,
    ResourceLicenseComponent,
    AffiliatedInstitutionsViewComponent,
    ContributorsListComponent,
    SubjectsListComponent,
    TagsListComponent,
  ],
  templateUrl: './registry-overview-metadata.component.html',
  styleUrl: './registry-overview-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryOverviewMetadataComponent {
  private readonly environment = inject(ENVIRONMENT);
  private readonly router = inject(Router);

  readonly registry = select(RegistrySelectors.getRegistry);
  readonly isAnonymous = select(RegistrySelectors.isRegistryAnonymous);

  canEdit = select(RegistrySelectors.hasWriteAccess);
  license = select(RegistrySelectors.getLicense);
  isLicenseLoading = select(RegistrySelectors.isLicenseLoading);
  identifiers = select(RegistrySelectors.getIdentifiers);
  isIdentifiersLoading = select(RegistrySelectors.isIdentifiersLoading);
  institutions = select(RegistrySelectors.getInstitutions);
  isInstitutionsLoading = select(RegistrySelectors.isInstitutionsLoading);
  subjects = select(SubjectsSelectors.getSubjects);
  isSubjectsLoading = select(SubjectsSelectors.getSubjectsLoading);

  bibliographicContributors = select(ContributorsSelectors.getBibliographicContributors);
  isBibliographicContributorsLoading = select(ContributorsSelectors.isBibliographicContributorsLoading);
  hasMoreBibliographicContributors = select(ContributorsSelectors.hasMoreBibliographicContributors);

  readonly currentResourceType = CurrentResourceType.Registrations;
  readonly dateFormat = 'MMM d, y, h:mm a';
  readonly webUrl = this.environment.webUrl;

  private readonly actions = createDispatchMap({
    getSubjects: FetchSelectedSubjects,
    getInstitutions: GetRegistryInstitutions,
    getIdentifiers: GetRegistryIdentifiers,
    getLicense: GetRegistryLicense,
    setCustomCitation: SetRegistryCustomCitation,
    loadMoreBibliographicContributors: LoadMoreBibliographicContributors,
  });

  constructor() {
    effect(() => {
      if (this.registry()?.id) {
        this.actions.getInstitutions(this.registry()!.id);
        this.actions.getSubjects(this.registry()!.id, ResourceType.Registration);
        this.actions.getLicense(this.registry()!.licenseId);
        this.actions.getIdentifiers(this.registry()!.id);
      }
    });
  }

  onCustomCitationUpdated(citation: string): void {
    this.actions.setCustomCitation(citation);
  }

  handleLoadMoreContributors(): void {
    this.actions.loadMoreBibliographicContributors(this.registry()?.id, ResourceType.Registration);
  }

  tagClicked(tag: string) {
    this.router.navigate(['/search'], { queryParams: { search: tag } });
  }
}
