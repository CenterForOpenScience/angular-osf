import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ResourceCitationsComponent } from '@osf/shared/components/resource-citations/resource-citations.component';
import { ResourceDoiComponent } from '@osf/shared/components/resource-doi/resource-doi.component';
import { ResourceLicenseComponent } from '@osf/shared/components/resource-license/resource-license.component';
import { SubjectsListComponent } from '@osf/shared/components/subjects-list/subjects-list.component';
import { TagsListComponent } from '@osf/shared/components/tags-list/tags-list.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CollectionsSelectors, GetProjectSubmissions } from '@osf/shared/stores/collections';
import {
  ContributorsSelectors,
  GetBibliographicContributors,
  LoadMoreBibliographicContributors,
} from '@osf/shared/stores/contributors';
import { FetchSelectedSubjects, SubjectsSelectors } from '@osf/shared/stores/subjects';

import {
  GetProjectIdentifiers,
  GetProjectInstitutions,
  GetProjectLicense,
  GetProjectPreprints,
  ProjectOverviewSelectors,
  SetProjectCustomCitation,
} from '../../store';
import { OverviewCollectionsComponent } from '../overview-collections/overview-collections.component';
import { OverviewSupplementsComponent } from '../overview-supplements/overview-supplements.component';

@Component({
  selector: 'osf-project-overview-metadata',
  imports: [
    Button,
    TranslatePipe,
    RouterLink,
    DatePipe,
    TruncatedTextComponent,
    ResourceCitationsComponent,
    OverviewCollectionsComponent,
    AffiliatedInstitutionsViewComponent,
    ContributorsListComponent,
    ResourceDoiComponent,
    ResourceLicenseComponent,
    SubjectsListComponent,
    TagsListComponent,
    OverviewSupplementsComponent,
  ],
  templateUrl: './project-overview-metadata.component.html',
  styleUrl: './project-overview-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewMetadataComponent {
  private readonly router = inject(Router);

  readonly currentProject = select(ProjectOverviewSelectors.getProject);
  readonly isAnonymous = select(ProjectOverviewSelectors.isProjectAnonymous);
  readonly canEdit = select(ProjectOverviewSelectors.hasWriteAccess);
  readonly institutions = select(ProjectOverviewSelectors.getInstitutions);
  readonly isInstitutionsLoading = select(ProjectOverviewSelectors.isInstitutionsLoading);
  readonly identifiers = select(ProjectOverviewSelectors.getIdentifiers);
  readonly isIdentifiersLoading = select(ProjectOverviewSelectors.isIdentifiersLoading);
  readonly license = select(ProjectOverviewSelectors.getLicense);
  readonly isLicenseLoading = select(ProjectOverviewSelectors.isLicenseLoading);
  readonly preprints = select(ProjectOverviewSelectors.getPreprints);
  readonly isPreprintsLoading = select(ProjectOverviewSelectors.isPreprintsLoading);
  readonly subjects = select(SubjectsSelectors.getSelectedSubjects);
  readonly areSelectedSubjectsLoading = select(SubjectsSelectors.areSelectedSubjectsLoading);
  readonly bibliographicContributors = select(ContributorsSelectors.getBibliographicContributors);
  readonly isBibliographicContributorsLoading = select(ContributorsSelectors.isBibliographicContributorsLoading);
  readonly hasMoreBibliographicContributors = select(ContributorsSelectors.hasMoreBibliographicContributors);
  readonly projectSubmissions = select(CollectionsSelectors.getCurrentProjectSubmissions);
  readonly isProjectSubmissionsLoading = select(CollectionsSelectors.getCurrentProjectSubmissionsLoading);

  readonly resourceType = CurrentResourceType.Projects;
  readonly dateFormat = 'MMM d, y, h:mm a';

  private readonly actions = createDispatchMap({
    getInstitutions: GetProjectInstitutions,
    getIdentifiers: GetProjectIdentifiers,
    getLicense: GetProjectLicense,
    getPreprints: GetProjectPreprints,
    setCustomCitation: SetProjectCustomCitation,
    getSubjects: FetchSelectedSubjects,
    getProjectSubmissions: GetProjectSubmissions,
    getBibliographicContributors: GetBibliographicContributors,
    loadMoreBibliographicContributors: LoadMoreBibliographicContributors,
  });

  constructor() {
    effect(() => {
      const project = this.currentProject();

      if (project?.id) {
        this.actions.getBibliographicContributors(project.id, ResourceType.Project);
        this.actions.getInstitutions(project.id);
        this.actions.getIdentifiers(project.id);
        this.actions.getPreprints(project.id);
        this.actions.getSubjects(project.id, ResourceType.Project);
        this.actions.getProjectSubmissions(project.id);
        this.actions.getLicense(project.licenseId);
      }
    });
  }

  onCustomCitationUpdated(citation: string): void {
    this.actions.setCustomCitation(citation);
  }

  handleLoadMoreContributors(): void {
    this.actions.loadMoreBibliographicContributors(this.currentProject()?.id, ResourceType.Project);
  }

  tagClicked(tag: string) {
    this.router.navigate(['/search'], { queryParams: { search: tag } });
  }
}
