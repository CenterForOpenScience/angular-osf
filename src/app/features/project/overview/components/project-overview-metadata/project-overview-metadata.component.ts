import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { CedarMetadataDataTemplateJsonApi } from '@osf/features/metadata/models';
import { GetCedarMetadataRecords, GetCustomItemMetadata, MetadataSelectors } from '@osf/features/metadata/store';
import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { FundersListComponent } from '@osf/shared/components/funders-list/funders-list.component';
import { ResourceCitationsComponent } from '@osf/shared/components/resource-citations/resource-citations.component';
import { ResourceDoiComponent } from '@osf/shared/components/resource-doi/resource-doi.component';
import { ResourceLicenseComponent } from '@osf/shared/components/resource-license/resource-license.component';
import { SubjectsListComponent } from '@osf/shared/components/subjects-list/subjects-list.component';
import { TagsListComponent } from '@osf/shared/components/tags-list/tags-list.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { LanguageLabelPipe } from '@osf/shared/pipes/language-label.pipe';
import { ResourceTypeGeneralLabelPipe } from '@osf/shared/pipes/resource-type-general-label.pipe';
import { MetadataService } from '@osf/shared/services/metadata.service';
import { CollectionsSelectors, GetProjectSubmissions } from '@osf/shared/stores/collections';
import {
  ContributorsSelectors,
  GetBibliographicContributors,
  LoadMoreBibliographicContributors,
} from '@osf/shared/stores/contributors';
import { FetchSelectedSubjects, SubjectsSelectors } from '@osf/shared/stores/subjects';
import { COLLECTION_SUBMISSION_WITH_CEDAR } from '@shared/constants/feature-flags.const';

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
    FundersListComponent,
    ResourceDoiComponent,
    ResourceLicenseComponent,
    SubjectsListComponent,
    TagsListComponent,
    OverviewSupplementsComponent,
    LanguageLabelPipe,
    ResourceTypeGeneralLabelPipe,
  ],
  templateUrl: './project-overview-metadata.component.html',
  styleUrl: './project-overview-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewMetadataComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly metadataService = inject(MetadataService);

  readonly currentProject = select(ProjectOverviewSelectors.getProject);
  readonly isAnonymous = select(ProjectOverviewSelectors.isProjectAnonymous);
  readonly canEdit = select(ProjectOverviewSelectors.hasWriteAccess);
  readonly customItemMetadata = select(MetadataSelectors.getCustomItemMetadata);
  readonly isCustomItemMetadataLoading = select(MetadataSelectors.isCustomItemMetadataLoading);
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
  readonly activeFlags = select(UserSelectors.getActiveFlags);
  readonly cedarRecords = select(MetadataSelectors.getCedarRecords);
  readonly isCedarMode = computed(() => this.activeFlags().includes(COLLECTION_SUBMISSION_WITH_CEDAR));

  private readonly cedarTemplatesMap = signal<Map<string, CedarMetadataDataTemplateJsonApi>>(new Map());
  readonly cedarTemplates = computed(() => [...this.cedarTemplatesMap().values()]);

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
    getCustomItemMetadata: GetCustomItemMetadata,
    getBibliographicContributors: GetBibliographicContributors,
    loadMoreBibliographicContributors: LoadMoreBibliographicContributors,
    getCedarRecords: GetCedarMetadataRecords,
  });

  constructor() {
    effect(() => {
      const project = this.currentProject();

      if (project?.id) {
        this.cedarTemplatesMap.set(new Map());
        this.actions.getBibliographicContributors(project.id, ResourceType.Project);
        this.actions.getInstitutions(project.id);
        this.actions.getIdentifiers(project.id);
        this.actions.getPreprints(project.id);
        this.actions.getSubjects(project.id, ResourceType.Project);
        this.actions.getProjectSubmissions(project.id);
        this.actions.getLicense(project.licenseId);
        this.actions.getCedarRecords(project.id, ResourceType.Project);
        this.actions.getCustomItemMetadata(project.id);
      }
    });

    effect(() => {
      const records = this.cedarRecords();
      if (!records?.length) return;

      const currentMap = this.cedarTemplatesMap();
      const missingIds = [
        ...new Set(records.map((r) => r.relationships?.template?.data?.id).filter((id): id is string => !!id)),
      ].filter((id) => !currentMap.has(id));

      missingIds.forEach((id) => {
        this.metadataService
          .getMetadataCedarTemplate(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((response) => {
            this.cedarTemplatesMap.update((map) => new Map(map).set(id, response.data));
          });
      });
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
