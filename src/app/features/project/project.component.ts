import { createDispatchMap, select } from '@ngxs/store';

import { map } from 'rxjs';

import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';
import { PrerenderReadyService } from '@core/services/prerender-ready.service';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { ContributorsSelectors, GetBibliographicContributors } from '@osf/shared/stores/contributors';

import {
  GetProjectById,
  GetProjectIdentifiers,
  GetProjectInstitutions,
  GetProjectLicense,
  ProjectOverviewSelectors,
} from './overview/store';

@Component({
  selector: 'osf-project',
  imports: [RouterOutlet],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class ProjectComponent implements OnDestroy {
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full';

  private readonly helpScoutService = inject(HelpScoutService);
  private readonly metaTags = inject(MetaTagsService);
  private readonly dataciteService = inject(DataciteService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly datePipe = inject(DatePipe);
  private readonly prerenderReady = inject(PrerenderReadyService);

  readonly identifiersForDatacite$ = toObservable(select(ProjectOverviewSelectors.getIdentifiers)).pipe(
    map((identifiers) => (identifiers?.length ? { identifiers } : null))
  );

  readonly currentProject = select(ProjectOverviewSelectors.getProject);
  readonly isProjectLoading = select(ProjectOverviewSelectors.getProjectLoading);
  readonly bibliographicContributors = select(ContributorsSelectors.getBibliographicContributors);
  readonly isBibliographicContributorsLoading = select(ContributorsSelectors.isBibliographicContributorsLoading);
  readonly license = select(ProjectOverviewSelectors.getLicense);
  readonly isLicenseLoading = select(ProjectOverviewSelectors.isLicenseLoading);
  readonly institutions = select(ProjectOverviewSelectors.getInstitutions);
  readonly isInstitutionsLoading = select(ProjectOverviewSelectors.isInstitutionsLoading);

  private projectId = toSignal(this.route.params.pipe(map((params) => params['id'])));

  private readonly allDataLoaded = computed(
    () =>
      !this.isProjectLoading() &&
      !this.isBibliographicContributorsLoading() &&
      !this.isLicenseLoading() &&
      !this.isInstitutionsLoading() &&
      !!this.currentProject()
  );

  private readonly lastMetaTagsProjectId = signal<string | null>(null);

  private readonly actions = createDispatchMap({
    getProject: GetProjectById,
    getLicense: GetProjectLicense,
    getInstitutions: GetProjectInstitutions,
    getIdentifiers: GetProjectIdentifiers,
    getBibliographicContributors: GetBibliographicContributors,
  });

  constructor() {
    this.prerenderReady.setNotReady();
    this.helpScoutService.setResourceType('project');

    effect(() => {
      const id = this.projectId();

      if (id) {
        this.actions.getProject(id);
        this.actions.getIdentifiers(id);
        this.actions.getBibliographicContributors(id, ResourceType.Project);
        this.actions.getInstitutions(id);
      }
    });

    effect(() => {
      const project = this.currentProject();

      if (project?.licenseId) {
        this.actions.getLicense(project.licenseId);
      }
    });

    effect(() => {
      if (this.allDataLoaded()) {
        const currentProjectId = this.projectId();
        const lastSetProjectId = this.lastMetaTagsProjectId();

        if (currentProjectId && currentProjectId !== lastSetProjectId) {
          this.setMetaTags();
        }
      }
    });

    this.dataciteService
      .logIdentifiableView(this.identifiersForDatacite$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.helpScoutService.unsetResourceType();
  }

  private setMetaTags(): void {
    const project = this.currentProject();
    if (!project) return;

    const keywords = [...(project.tags || []), ...(project.category ? [project.category] : [])];

    const metaTagsData = {
      osfGuid: project.id,
      title: project.title,
      description: project.description,
      url: project.links?.iri,
      license: this.license.name,
      publishedDate: this.datePipe.transform(project.dateCreated, 'yyyy-MM-dd'),
      modifiedDate: this.datePipe.transform(project.dateModified, 'yyyy-MM-dd'),
      keywords,
      institution: this.institutions().map((institution) => institution.name),
      contributors: this.bibliographicContributors().map((contributor) => ({
        fullName: contributor.fullName,
        givenName: contributor.givenName,
        familyName: contributor.familyName,
      })),
    };

    this.metaTags.updateMetaTags(metaTagsData, this.destroyRef);

    this.lastMetaTagsProjectId.set(project.id);
  }
}
