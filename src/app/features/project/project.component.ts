import { createDispatchMap, select } from '@ngxs/store';

import { filter, map } from 'rxjs';

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
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';
import { PrerenderReadyService } from '@core/services/prerender-ready.service';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import {
  getDeepestCanonicalPathTemplateFromSnapshot,
  resolveCanonicalPathFromSnapshot,
} from '@osf/shared/helpers/canonical-path.helper';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { MetaTagsBuilderService } from '@osf/shared/services/meta-tags-builder.service';
import { ContributorsSelectors, GetBibliographicContributors } from '@osf/shared/stores/contributors';
import { AnalyticsService } from '@shared/services/analytics.service';
import { CurrentResourceSelectors } from '@shared/stores/current-resource';

import { GetProjectById, GetProjectIdentifiers, GetProjectLicense, ProjectOverviewSelectors } from './overview/store';
import { UserSelectors } from '@core/store/user';

@Component({
  selector: 'osf-project',
  imports: [RouterOutlet],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent implements OnDestroy {
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full';

  private readonly helpScoutService = inject(HelpScoutService);
  private readonly metaTags = inject(MetaTagsService);
  private readonly metaTagsBuilder = inject(MetaTagsBuilderService);
  private readonly dataciteService = inject(DataciteService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly prerenderReady = inject(PrerenderReadyService);
  private readonly router = inject(Router);
  private readonly analyticsService = inject(AnalyticsService);

  readonly currentUser = select(UserSelectors.getCurrentUser);
  readonly currentResource = select(CurrentResourceSelectors.getCurrentResource);
  readonly currentProject = select(ProjectOverviewSelectors.getProject);
  readonly isProjectLoading = select(ProjectOverviewSelectors.getProjectLoading);
  readonly bibliographicContributors = select(ContributorsSelectors.getBibliographicContributors);
  readonly isBibliographicContributorsLoading = select(ContributorsSelectors.isBibliographicContributorsLoading);
  readonly license = select(ProjectOverviewSelectors.getLicense);
  readonly isLicenseLoading = select(ProjectOverviewSelectors.isLicenseLoading);

  readonly identifiersForDatacite$ = toObservable(select(ProjectOverviewSelectors.getIdentifiers)).pipe(
    map((identifiers) => (identifiers?.length ? { identifiers } : null))
  );

  private readonly actions = createDispatchMap({
    getProject: GetProjectById,
    getLicense: GetProjectLicense,
    getIdentifiers: GetProjectIdentifiers,
    getBibliographicContributors: GetBibliographicContributors,
  });

  private readonly projectId = toSignal(this.route.params.pipe(map((params) => params['id'])));
  private readonly canonicalPath = signal(this.getCanonicalPathFromSnapshot());
  private readonly isFileDetailRoute = signal(this.isFileDetailRouteFromSnapshot());
  private readonly lastMetaTagsKey = signal<string | null>(null);

  private readonly allDataLoaded = computed(
    () =>
      !this.isProjectLoading() &&
      !this.isBibliographicContributorsLoading() &&
      !this.isLicenseLoading() &&
      !!this.currentProject()
  );

  constructor() {
    this.prerenderReady.setNotReady();
    this.helpScoutService.setResourceType('project');

    effect(() => {
      const id = this.projectId();

      if (id) {
        this.actions.getProject(id);
        this.actions.getIdentifiers(id);
        this.actions.getBibliographicContributors(id, ResourceType.Project);
      }
    });

    effect(() => {
      const licenseId = this.currentProject()?.licenseId;

      if (licenseId) {
        this.actions.getLicense(licenseId);
      }
    });

    effect(() => {
      if (!this.allDataLoaded()) {
        this.lastMetaTagsKey.set(null);
        return;
      }

      const currentProjectId = this.currentProject()?.id;
      const currentCanonicalPath = this.canonicalPath();

      if (!currentProjectId || !currentCanonicalPath || this.isFileDetailRoute()) {
        this.lastMetaTagsKey.set(null);
        return;
      }

      const metaTagsKey = `${currentProjectId}:${currentCanonicalPath}`;

      if (this.lastMetaTagsKey() === metaTagsKey) {
        return;
      }

      this.lastMetaTagsKey.set(metaTagsKey);
      this.setMetaTags();
    });

    this.dataciteService
      .logIdentifiableView(this.identifiersForDatacite$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: NavigationEnd) => {
        this.canonicalPath.set(this.getCanonicalPathFromSnapshot());
        this.isFileDetailRoute.set(this.isFileDetailRouteFromSnapshot());
        const contributors = this.bibliographicContributors()
        const user = this.currentUser()
        // update project count metrics if user is not contributor or is not authentified
        if (!user?.id || !contributors.some((contributor) => contributor.userId === user.id)) {
          this.analyticsService.sendCountedUsageForRegistrationAndProjects(
            event.urlAfterRedirects,
            this.currentResource()
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.helpScoutService.unsetResourceType();
  }

  private setMetaTags(): void {
    const project = this.currentProject()!;

    const metaTagsData = this.metaTagsBuilder.buildProjectMetaTagsData({
      project,
      canonicalPath: this.canonicalPath(),
      contributors: this.bibliographicContributors(),
      licenseName: this.license.name,
    });

    this.metaTags.updateMetaTags(metaTagsData, this.destroyRef);
  }

  private getCanonicalPathFromSnapshot(): string {
    return resolveCanonicalPathFromSnapshot(this.route.snapshot, {
      fallbackPath: 'overview',
      paramDefaults: {
        fileProvider: 'osfstorage',
        recordId: 'osf',
      },
    });
  }

  private isFileDetailRouteFromSnapshot(): boolean {
    return getDeepestCanonicalPathTemplateFromSnapshot(this.route.snapshot) === 'files/:fileGuid';
  }
}
